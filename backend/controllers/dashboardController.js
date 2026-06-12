const supabase = require("../config/supabase");

const getDashboard = async (req, res) => {

    try {

        const { data: assignments } = await supabase
            .from("assignments")
            .select("*");

        const { data: attendance } = await supabase
            .from("attendance")
            .select("*");

        const totalAssignments =
            assignments?.length || 0;

        const pendingAssignments =
            assignments?.filter(
                a => a.status === "Pending"
            ).length || 0;

        const completedAssignments =
            assignments?.filter(
                a => a.status === "Completed"
            ).length || 0;

        let averageAttendance = 0;

        if (attendance?.length) {

            const total =
                attendance.reduce(
                    (sum, item) =>
                        sum +
                        ((item.present_classes /
                            item.total_classes) * 100),
                    0
                );

            averageAttendance =
                (total / attendance.length)
                    .toFixed(2);
        }

        res.json({
            totalAssignments,
            pendingAssignments,
            completedAssignments,
            totalSubjects:
                attendance?.length || 0,
            averageAttendance
        });

    } catch (error) {

        res.status(500).json({
            error: "Dashboard failed"
        });

    }

};

module.exports = {
    getDashboard
};