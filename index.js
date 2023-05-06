// Requires
const fastify = require('fastify')({ logger: false })

// check if it's test env
const isDevEnv = process.env.npm_lifecycle_event === 'dev'

// if is not a production environment
if (isDevEnv) {
    const dotenv = require('dotenv')
    dotenv.config()
}

function getConfig() {
    return {
        PORT: process.env.PORT || 8080,
        PREFIX: process.env.VAR_PREFIX || 'URL_',
        IS_ONE_LINE_SYNTAX: process.env.IS_ONE_LINE_SYNTAX == 1,
        DEBUG: process.env.DEBUG == 1,
        ONE_LINE_DELIMITER: process.env.ONE_LINE_DELIMITER || '|',
    }
}

function getUrlsFromEnv(config) {

    // Get all env keys
    const envKeys = Object.keys(process.env)

    // Create empty objects
    const urls = {}
    const temp = {}

    // loop through all env variables
    for (let i = 0; i < envKeys.length; i++) {
        const key = envKeys[i]
        
        const value = process.env[key]
        if (key.startsWith(config.PREFIX)) {
            
            let name = key.replace(config.PREFIX, '')

            if (config.IS_ONE_LINE_SYNTAX !== true) {
                let url = value;
                if (key.endsWith('_GO')) {
                    name = name.replace('_GO', '')
                    if (!temp[name]) urls[name] = {}
                    temp[name] = { ...temp[name], go: url }
                } else if (key.endsWith('_ID')) {
                    name = name.replace('_ID', '')
                    if (!temp[name]) temp[name] = {}
                    temp[name] = { ...temp[name], id: value }
                }

                const tempKeys = Object.keys(temp)
                for (tempKey of tempKeys) {
                    const item = temp[tempKey]
                    if (item.id && item.go) {
                        urls[item.id] = item.go
                    }
                }

            } else {

                const ids = value.split(config.ONE_LINE_DELIMITER)
                let url = ids.pop()

                for (id of ids) {
                    urls[id] = url
                }
            }

        }
    }

    return urls
}

function formatUrl(url) {
    if (!url.toLowerCase().startsWith("https://") && !url.toLowerCase().startsWith("http://")) {
        url = `https://${url}`
    }
    return url
}


function main() {
    // load config
    const config = getConfig()

    // get urls
    const urls = getUrlsFromEnv(config)

    if (config.DEBUG) {
        console.log(config);
        console.log(urls)
    }

    fastify.get('/', async (request, reply) => {
        if (urls["*"]) {
            reply.redirect(formatUrl(urls["*"].go))
        } else {
            reply.code(404).send({
                message: 'Not found'
            })
        }
    })

    fastify.get("/:id", async (request, reply) => {
        const id = request.params.id
        
        if (id === 'debug' && config.DEBUG) {
            reply.code(200).send({
                message: JSON.stringify({
                    config, urls
                })
            })
            return
        }
        
        if (urls[id]) {
            reply.redirect(formatUrl(urls[id]))
            return
        }
        reply.code(404).send({
            message: 'Not found'
        })
        return
    })

    // start server
    fastify.listen({ port: config.PORT }, (err, address) => {
        if (err) throw err
        console.log(`Server listening on ${config.PORT}`)
    })
}

// run app
main()