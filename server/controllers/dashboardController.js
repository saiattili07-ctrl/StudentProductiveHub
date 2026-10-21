import asyncHandler from "../utils/asyncHandler.js";
import Task, { TASK_STATUSES } from "../models/Task.js";
import StudySession from "../models/StudySession.js";
import { startOfTodayUTC, addDaysUTC, toDateKey } from "../utils/dateUtils.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const today = startOfTodayUTC();
  const weekStart = addDaysUTC(today, -6);
  const notCompleted = { $ne: "completed" };

  const [
    total,
    completed,
    inProgress,
    overdue,
    upcomingDeadlines,
    recentTasks,
    sessionsByStatus,
    weekMinutes,
    plannedUpcoming,
  ] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.countDocuments({ user: userId, status: "completed" }),
    Task.countDocuments({ user: userId, status: "in-progress" }),
    Task.countDocuments({
      user: userId,
      status: notCompleted,
      dueDate: { $lt: today },
    }),
    Task.find({ user: userId, status: notCompleted, dueDate: { $gte: today } })
      .sort({ dueDate: 1 })
      .limit(5),
    Task.find({ user: userId }).sort({ createdAt: -1 }).limit(5),
    StudySession.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          minutes: { $sum: "$durationMinutes" },
        },
      },
    ]),
    StudySession.aggregate([
      {
        $match: {
          user: userId,
          status: "completed",
          date: { $gte: weekStart },
        },
      },
      { $group: { _id: null, minutes: { $sum: "$durationMinutes" } } },
    ]),
    StudySession.countDocuments({
      user: userId,
      status: "planned",
      date: { $gte: today },
    }),
  ]);

  const byStatus = Object.fromEntries(
    sessionsByStatus.map((row) => [row._id, row]),
  );

  res.status(200).json({
    success: true,
    taskStats: {
      total,
      completed,
      inProgress,
      pending: Math.max(total - completed - inProgress, 0),
      overdue,
      completionPercentage: total ? Math.round((completed / total) * 100) : 0,
    },
    upcomingDeadlines,
    recentTasks,
    studyStats: {
      totalSessions: sessionsByStatus.reduce((sum, row) => sum + row.count, 0),
      completedSessions: byStatus.completed?.count || 0,
      plannedSessions: byStatus.planned?.count || 0,
      missedSessions: byStatus.missed?.count || 0,
      completedMinutes: byStatus.completed?.minutes || 0,
      completedMinutesThisWeek: weekMinutes[0]?.minutes || 0,
      upcomingSessions: plannedUpcoming,
    },
  });
});

export const getAnalytics = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const requested = Number(req.query.days);
  const days = [7, 14, 30].includes(requested) ? requested : 7;

  const today = startOfTodayUTC();
  const start = addDaysUTC(today, -(days - 1));
  const end = addDaysUTC(today, 1);

  const completedSessionMatch = {
    user: userId,
    status: "completed",
    date: { $gte: start, $lt: end },
  };

  const [taskDaily, studyDaily, taskSubjects, studySubjects, statusCounts] =
    await Promise.all([
      Task.aggregate([
        {
          $match: {
            user: userId,
            status: "completed",
            completedAt: { $gte: start, $lt: end },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$completedAt" },
            },
            count: { $sum: 1 },
          },
        },
      ]),
      StudySession.aggregate([
        { $match: completedSessionMatch },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            minutes: { $sum: "$durationMinutes" },
          },
        },
      ]),
      Task.aggregate([
        { $match: { user: userId } },
        {
          $group: {
            _id: "$subject",
            total: { $sum: 1 },
            completed: {
              $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
            },
          },
        },
        { $sort: { total: -1 } },
      ]),
      StudySession.aggregate([
        { $match: completedSessionMatch },
        { $group: { _id: "$subject", minutes: { $sum: "$durationMinutes" } } },
        { $sort: { minutes: -1 } },
      ]),
      Task.aggregate([
        { $match: { user: userId } },
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
    ]);

  const taskMap = Object.fromEntries(
    taskDaily.map((row) => [row._id, row.count]),
  );
  const studyMap = Object.fromEntries(
    studyDaily.map((row) => [row._id, row.minutes]),
  );

  const daily = [];
  for (let i = 0; i < days; i += 1) {
    const date = addDaysUTC(start, i);
    const key = toDateKey(date);
    daily.push({
      date: key,
      label:
        days <= 7
          ? date.toLocaleDateString("en-US", {
              weekday: "short",
              timeZone: "UTC",
            })
          : key.slice(5),
      tasksCompleted: taskMap[key] || 0,
      studyMinutes: studyMap[key] || 0,
    });
  }

  const statusMap = Object.fromEntries(
    statusCounts.map((row) => [row._id, row.count]),
  );

  res.status(200).json({
    success: true,
    days,
    daily,
    totals: {
      tasksCompleted: daily.reduce((sum, d) => sum + d.tasksCompleted, 0),
      studyMinutes: daily.reduce((sum, d) => sum + d.studyMinutes, 0),
    },
    subjectDistribution: {
      tasks: taskSubjects.map((row) => ({
        subject: row._id,
        total: row.total,
        completed: row.completed,
      })),
      studyMinutes: studySubjects.map((row) => ({
        subject: row._id,
        minutes: row.minutes,
      })),
    },
    statusDistribution: TASK_STATUSES.map((status) => ({
      status,
      count: statusMap[status] || 0,
    })),
  });
});
