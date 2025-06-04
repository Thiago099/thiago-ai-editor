import "./popup.css"
class Popup{
    static colorSuccess = "#4CAF50"
    static colorError = "#F44336"
    static colorWarning = "#FF9800"
    static colorInfo = "#2196F3"
    static Show(message, color) {
        const popup = document.createElement('div');
        popup.className = 'popup';
        popup.style.backgroundColor = color;
        popup.innerHTML = message;
        document.getElementById('popupContainer').appendChild(popup);
        setTimeout(() => {
            popup.remove();
        }, 3000);
    }
        
    static ShowSuccess(message) {
        this.Show(message, this.colorSuccess);
    }
    
    static ShowError(message) {
        this.Show(message, this.colorError);
    }
    
    static ShowWarning(message) {
        this.Show(message, this.colorWarning);
    }
    
    static ShowInfo(message) {
        this.Show(message, this.colorInfo);
    }
}
export {Popup}