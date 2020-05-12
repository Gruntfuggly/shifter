var vscode = require( 'vscode' );
var util = require( "./shifterUtil" );

var listStart;
var listEnd;

var Shifter = ( function()
{
    function Shifter()
    {
    }

    class SearchResult
    {
        constructor( bracket, offset )
        {
            this.bracket = bracket;
            this.offset = offset;
        }
    }

    function findBackward( text, index )
    {
        var bracketStack = [];
        var offset = 0;
        var bracket = '';

        for( var i = index; i >= 0; i-- )
        {
            var char = text.charAt( i );
            if( util.shifterUtil.isOpenBracket( char ) )
            {
                if( bracketStack.length === 0 )
                {
                    bracket = char;
                    offset = i;
                    break;
                }
                else
                {
                    var top = bracketStack.pop();
                    if( !util.shifterUtil.isMatch( char, top ) )
                    {
                        throw 'Unmatched bracket pair';
                    }
                }
            }
            else if( util.shifterUtil.isCloseBracket( char ) )
            {
                bracketStack.push( char );
            }
        }

        return new SearchResult( bracket, offset );
    }

    function findForward( text, index )
    {
        var bracketStack = [];
        var offset = text.length;
        var bracket = '';
        for( var i = index; i < text.length; i++ )
        {
            var char = text.charAt( i );
            if( util.shifterUtil.isCloseBracket( char ) )
            {
                if( bracketStack.length === 0 )
                {
                    offset = i;
                    bracket = char;
                    break;
                }
                else
                {
                    var top = bracketStack.pop();
                    if( !util.shifterUtil.isMatch( top, char ) )
                    {
                        throw 'Unmatched bracket pair';
                    }
                }
            }
            else if( util.shifterUtil.isOpenBracket( char ) )
            {
                bracketStack.push( char );
            }
        }
        return new SearchResult( bracket, offset );
    }

    function update()
    {
        var editor = vscode.window.activeTextEditor;

        if( !editor || !editor.selection.isEmpty )
        {
            return;
        }

        var offset = editor.document.offsetAt( editor.selection.active );
        var text = editor.document.getText();

        try
        {
            var backwardResult = findBackward( text, offset - 1 );
            var forwardResult = findForward( text, offset );

            if( util.shifterUtil.isMatch( backwardResult.bracket, forwardResult.bracket ) )
            {
                listStart = backwardResult.offset < text.length ? backwardResult.offset + 1 : backwardResult.offset;
                listEnd = forwardResult.offset;
                var list = text.substring( listStart, listEnd );
            }
        }
        catch( error )
        {
        }
    }

    Shifter.prototype.update = update;

    Shifter.prototype.dispose = function()
    {
    };

    Array.prototype.move = function( oldIndex, newIndex )
    {
        if( newIndex >= this.length )
        {
            var k = newIndex - this.length;
            while( ( k-- ) + 1 )
            {
                this.push( undefined );
            }
        }
        this.splice( newIndex, 0, this.splice( oldIndex, 1 )[ 0 ] );
    };

    function makeUpdate( list, repositionCursor )
    {
        var editor = vscode.window.activeTextEditor;
        var edit = new vscode.WorkspaceEdit();
        var range = new vscode.Range( editor.document.positionAt( listStart ), editor.document.positionAt( listEnd ) );
        var replacement = list.join( "," );
        edit.replace( editor.document.uri, range, replacement );
        vscode.workspace.applyEdit( edit ).then( function()
        {
            repositionCursor();
            var formatRange = new vscode.Range( editor.document.positionAt( listStart ), editor.document.positionAt( listEnd + 1 ) );
            vscode.commands.executeCommand(
                'vscode.executeFormatRangeProvider',
                editor.document.uri,
                formatRange,
                {}
            ).then( function( edits )
            {
                var workspaceEdit = new vscode.WorkspaceEdit();
                workspaceEdit.set( editor.document.uri, edits );
                vscode.workspace.applyEdit( workspaceEdit ).then( update );
            } );
        } );
    }

    function getElements()
    {
        var editor = vscode.window.activeTextEditor;
        var text = editor.document.getText();
        var offset = editor.document.offsetAt( editor.selection.active );

        var list = text.substring( listStart, listEnd );
        var regex = /(?:[^,]+|\\.)+/g;
        var matched = null;
        var elements = [];
        var currentElement = -1;
        var index = 0;
        while( ( matched = regex.exec( list ) ) !== null )
        {
            elements.push( matched[ 0 ] );
            if( offset >= listStart + matched.index && offset <= listStart + matched.index + matched[ 0 ].length )
            {
                currentElement = index;
            }
            ++index;
        }

        return currentElement === -1 ? undefined : { elements: elements, currentElement: currentElement };
    }

    Shifter.prototype.shiftArgumentLeft = function()
    {
        var editor = vscode.window.activeTextEditor;
        var originalPosition = editor.document.offsetAt( editor.selection.active );

        var list = getElements();
        if( list )
        {
            if( list.currentElement > 0 )
            {
                list.elements.move( list.currentElement, list.currentElement - 1 );

                makeUpdate( list.elements, function()
                {
                    var newPosition = editor.document.positionAt( originalPosition - list.elements[ list.currentElement ].length - 1 );
                    editor.selection = new vscode.Selection( newPosition, newPosition );
                } );
            }
        }
    };

    Shifter.prototype.shiftArgumentRight = function()
    {
        var editor = vscode.window.activeTextEditor;
        var originalPosition = editor.document.offsetAt( editor.selection.active );

        var list = getElements();
        if( list )
        {
            if( list.currentElement < list.elements.length - 1 )
            {
                list.elements.move( list.currentElement, list.currentElement + 1 );

                makeUpdate( list.elements, function()
                {
                    var newPosition = editor.document.positionAt( originalPosition + list.elements[ list.currentElement ].length + 1 );
                    editor.selection = new vscode.Selection( newPosition, newPosition );
                } );
            }
        }
    };

    return Shifter;
}() );

exports.Shifter = Shifter;
