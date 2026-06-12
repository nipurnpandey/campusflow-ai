const supabase = require("../config/supabase");

const updateAssignment = async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const { data, error } = await supabase
        .from("assignments")
        .update({ status })
        .eq("id", id)
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

const deleteAssignment = async (req, res) => {

    const { id } = req.params;

    const { error } = await supabase
        .from("assignments")
        .delete()
        .eq("id", id);

    if (error) {
        return res.status(500).json(error);
    }

    res.json({
        message: "Assignment deleted successfully"
    });
};

module.exports = {
    updateAssignment,
    deleteAssignment
};