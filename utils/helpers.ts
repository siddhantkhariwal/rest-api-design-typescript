function getReminders(dateString: string): Date[] {
    const targetDate = new Date(dateString);
    const duration = targetDate.getTime() - Date.now();
    const reminders = [
        duration / 4,
        duration / 2,
        3 * duration / 4
    ];
    return reminders.map(ele => new Date(Date.now() + ele));
}

export { getReminders };
