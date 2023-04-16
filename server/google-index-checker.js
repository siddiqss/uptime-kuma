const { default: axios } = require("axios");

const checkGoogleIndex = async (url) => {
    let splitUrl = url.includes("www")
        ? url.split("://www.")
        : url.split("://");

    let data = JSON.stringify({
        query: `site:${url}`,
        gl: "AU",
        hl: "en_AU",
    });

    let headers = {
        "Content-Type": "application/json",
        "x-api-key": "gfxC17BLE7qkaPzhh9Js45JG5C7VsIhj",
    };
    try {
        let res = await axios
            .post("https://api.serpsbot.com/v2/google/organic-search", data, {
                headers: headers,
            })
            .then((res) => {
                let result = res.data.data.organic;
                // console.log(result);
                if (result === undefined || result.length === 0) {
                    return false;
                }
                if (result[0].url.includes(splitUrl[1])) {
                    return true;
                }
                // // Result data
                // // console.log(result);
                // if (result.result[0].items_count === 0) {
                //     return false;
                // } else {
                //     return true;
                // }
            });
        // console.log(res);
        return res;
    } catch (error) {
        console.log(error);
    }
};

module.exports = { checkGoogleIndex };

// checkGoogleIndex("site:https://revivebaby123xyz.com");
