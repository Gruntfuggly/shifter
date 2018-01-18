var vscode = require( 'vscode' );

var ShifterController = ( function()
{
    function ShifterController( shifter )
    {
        this._shifter = shifter;

        var subscriptions = [];
        vscode.window.onDidChangeTextEditorSelection( this._onEvent, this, subscriptions );
        vscode.window.onDidChangeActiveTextEditor( this._onChangeEditor, this, subscriptions );

        this._onEvent();

        this._disposable = vscode.Disposable.from.apply( vscode.Disposable, subscriptions );
    }

    ShifterController.prototype.dispose = function()
    {
        this._disposable.dispose();
    };

    ShifterController.prototype._onChangeEditor = function()
    {
        this._shifter.update();
    };

    ShifterController.prototype._onEvent = function()
    {
        this._shifter.update();
    };

    return ShifterController;
}() );

exports.ShifterController = ShifterController;
