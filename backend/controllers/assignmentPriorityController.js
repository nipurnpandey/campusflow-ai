const getAssignmentPriority = async (req, res) => {

    const { deadline } = req.body;

    const today = new Date();
    const dueDate = new Date(deadline);

    const diffTime =
        dueDate - today;

    const daysLeft =
        Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let priority = "";

    if (daysLeft <= 3) {
        priority = "High";
    } else if (daysLeft <= 7) {
        priority = "Medium";
    } else {
        priority = "Low";
    }

    res.json({
        daysLeft,
        priority
    });
};

module.exports = {
    getAssignmentPriority
};