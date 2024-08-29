"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReminders = getReminders;
function getReminders(dateString) {
    const targetDate = new Date(dateString);
    const duration = targetDate.getTime() - Date.now();
    const reminders = [
        duration / 4,
        duration / 2,
        3 * duration / 4
    ];
    return reminders.map(ele => new Date(Date.now() + ele));
}
