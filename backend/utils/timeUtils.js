const timeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
    const hours = Math.floor(totalMinutes /60);
    const minutes = totalMinutes % 60;
    return '${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}';
};

const getDayOfWeek = (date) => {
    const day = date.getDay();
    return day === 0 ? 7 : day;
};

const isOverlapping = (start1, end1, start2, end2) => {
    return start1 < end2 && start2 <end1; 
};

module.exports = { timeToMinutes, minutesToTime, getDayOfWeek, isOverlapping };