const supabase = require("../config/supabase");

const getAssignmentAnalytics = async (req, res) => {

    const { data, error } = await supabase
        .from("assignments")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    const totalAssignments = data.length;

    const completedAssignments =
        data.filter(
            assignment =>
                assignment.status === "Completed"
        ).length;

    const pendingAssignments =
        data.filter(
            assignment =>
                assignment.status !== "Completed"
        ).length;

    const completionRate =
        totalAssignments === 0
            ? 0
            : (
                completedAssignments /
                totalAssignments
            ) * 100;

    res.json({
        totalAssignments,
        completedAssignments,
        pendingAssignments,
        completionRate:
            completionRate.toFixed(2)
    });
};

module.exports = {
    getAssignmentAnalytics
};