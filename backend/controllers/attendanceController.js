const supabase = require("../config/supabase");

// GET ALL ATTENDANCE

const getAttendance = async (req, res) => {

    const { data, error } = await supabase
        .from("attendance")
        .select("*");

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);

};


// CREATE ATTENDANCE

const createAttendance = async (req, res) => {

    const {
        subject,
        present_classes,
        total_classes
    } = req.body;

    const { data, error } = await supabase
        .from("attendance")
        .insert([
            {
                subject,
                present_classes,
                total_classes
            }
        ])
        .select();

    if (error) {
        return res.status(500).json(error);
    }

    res.status(201).json(data);

};

module.exports = {
    getAttendance,
    createAttendance
};