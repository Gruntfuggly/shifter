var vscode = require( 'vscode' );
var shifter = require( './shifter' );
var shifterController = require( './shifterController' );

function activate( context )
{
    var bs = new shifter.Shifter();
    var controller = new shifterController.ShifterController( bs );
    context.subscriptions.push( controller );
    context.subscriptions.push( bs );

    var shiftArgumentLeft = vscode.commands.registerCommand( 'shiftArgumentLeft', function()
    {
        bs.shiftArgumentLeft();
    } );
    var shiftArgumentRight = vscode.commands.registerCommand( 'shiftArgumentRight', function()
    {
        bs.shiftArgumentRight();
    } );

    context.subscriptions.push( shiftArgumentLeft );
    context.subscriptions.push( shiftArgumentRight );
}

exports.activate = activate;
