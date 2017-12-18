Object.defineProperty( exports, "__esModule", { value: true } );

var vscode = require( 'vscode' );
var shifterUtil;

( function( shifterUtil )
{
    var openingBrackets = "{([";
    var closingBrackets = "})]";

    function isMatch( open, close )
    {
        switch( open )
        {
            case '(': return close === ')';
            case '{': return close === '}';
            case '[': return close === ']';
        }
        return false;
    }

    shifterUtil.isMatch = isMatch;

    function isOpenBracket( char )
    {
        return openingBrackets.indexOf( char ) > -1;
    }

    shifterUtil.isOpenBracket = isOpenBracket;

    function isCloseBracket( char )
    {
        return closingBrackets.indexOf( char ) > -1;
    }

    shifterUtil.isCloseBracket = isCloseBracket;

} )( shifterUtil = exports.shifterUtil || ( exports.shifterUtil = {} ) );
