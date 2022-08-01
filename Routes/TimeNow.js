    const date_ob = new Date();
    const hours = date_ob.getHours();
    const minutes = date_ob.getMinutes();
    const seconds = date_ob.getSeconds();
    const TimeNow = hours + ":" + minutes + ":" + seconds;
    module.exports = TimeNow;