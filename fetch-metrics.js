require('dotenv').config()

// we need to copy the HCloud token for this
let token = process.env.API_TOKEN

const HetznerCloud = require('./lib')
let client = new HetznerCloud.Client(token)


async function main() {
    // const { servers } = await client.servers.list()

    const monitor = await client.servers.get(14201534)
    // console.log({ monitor })

    // console.log({ servers: client.servers })

    const metrics = await client.servers.getMetrics(14201534)
    console.log({ metrics: JSON.stringify(metrics) })

    // console.log(servers)
}

main()
// console.log({ token })