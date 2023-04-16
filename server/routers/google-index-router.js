let express = require("express");
const { allowDevAllOrigin } = require("../util-server");
const { R } = require("redbean-node");
const { log } = require("../../src/util");
const { checkGoogleIndex } = require("../google-index-checker");

let router = express.Router();

// let cache = apicache.middleware;
// const server = UptimeKumaServer.getInstance();

router.get("/api/fetch-index-status/:id", async (request, response) => {
    allowDevAllOrigin(response);
    let id = request.params.id;
    let monitorBean = await R.knex("monitor").where("id", id);
    // console.log(monitorBean.index_status);

    response.json({ monitorData: monitorBean[0] });
});

router.get("/api/check-google-index", async (request, response) => {
    allowDevAllOrigin(response);
    // console.log(request);
    log.debug("GOOGLE STATUS INDEX called.");
    let monitors = await R.findAll("monitor");
    // console.log(monitors);
    // let monitorsData = [];

    let responses = monitors.map(async (monitor) => {
        // monitorsData.push(monitor.url);
        let res = await checkGoogleIndex(monitor.url);
        // console.log(res);
        // monitorsData.push({
        //     name: monitor.url,
        //     indexStatus: res,
        // });
        if (res === true) {
            res = 1;
        } else if (res === false) {
            res = 0;
        }
        return {
            id: monitor.id,
            name: monitor.url,
            indexStatus: res,
        };
    });
    const data = await Promise.all(responses);
    await updateIndexStatus(data);

    response.json(data);
});

router.get("/api/check-google-index/:id", async (request, response) => {
    allowDevAllOrigin(response);
    let id = request.params.id;
    let monitorBean = await R.knex("monitor").where("id", id);

    let res = await checkGoogleIndex(monitorBean[0].url);

    if (res === true) {
        res = 1;
    } else if (res === false) {
        res = 0;
    }
    // return {
    //     id: monitor.id,
    //     name: monitor.url,
    //     indexStatus: res,
    // };
    let data = [
        {
            id: monitorBean[0].id,
            name: monitorBean[0].url,
            indexStatus: res,
        },
    ];
    // const data = await Promise.all(responses);
    await updateIndexStatus(data);
    response.json(data);
});

async function updateIndexStatus(data) {
    data.map(async (monitor) => {
        // let monitorBean = await R.find("monitor", "id = ?", [
        //     monitor.id,
        // ]);
        let monitorBean = await R.knex("monitor").where("id", monitor.id);
        console.log(monitorBean);
        await R.knex("monitor").where("id", monitor.id).update({
            index_status: monitor.indexStatus,
        });
        // monitorBean[0].indexStatus = monitor.indexStatus;
        // await R.store(monitorBean);
    });
}

module.exports = router;
