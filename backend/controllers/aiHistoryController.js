const supabase = require("../config/supabase");

const getAiHistory = async (req, res) => {

    const { data, error } = await supabase
        .from("ai_history")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        return res.status(500).json(error);
    }

    res.json(data);
};

module.exports = {
    getAiHistory
};