const checkNotificationPromise = () => {
    try {
      Notification.requestPermission().then();
    } catch(e) {
      return false;
    }

    return true;
  }

export const askNotificationPermission = async () => {
      if (('Notification' in window)) {
        if(checkNotificationPromise()) {
        const permission = await Notification.requestPermission();
            if(permission !== 'granted') {
                return false;
            }
            return true;
        } else {
          Notification.requestPermission(function(permission) {
            if(permission !== 'granted') {
                return false;
            }
            return true;
          });
        }
      }
      return false;
}
