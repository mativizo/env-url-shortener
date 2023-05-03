// Requires
const dotenv = require('dotenv')
const fastify = require('fastify')({ logger: false })

// check if it's test env
const isDevEnv = process.env.npm_lifecycle_event === 'dev'

// if is not a production environment
if (isDevEnv) dotenv.config()

// get port
const port = process.env.PORT || 3000

function getUrlsFromEnv(prefix) {
    
    // Get all env keys
    const envKeys = Object.keys(process.env)

    // Create empty object
    const urls = {}

    // loop through all env variables
    for (let i = 0; i < envKeys.length; i++) {
        const key = envKeys[i]
        const value = process.env[key]
        let name = key.replace(prefix, '')

        let url = value;
        let lowerCaseUrl = url.toLowerCase();
        if (!lowerCaseUrl.startsWith("https://") && !lowerCaseUrl.startsWith("http://")) {
            url = `https://${url}`
        }

        if (key.endsWith('_GO')) {
            name = name.replace('_GO', '')
            if (!urls[name]) urls[name] = {}
            urls[name] = {
                ...urls[name],
                go: url
            }
        } else if (key.endsWith('_ID')) {
            name = name.replace('_ID', '')
            if (!urls[name]) urls[name] = {}
            urls[name] = {
                ...urls[name],
                id: value
            }
        }
    }
    
    return urls
}


function main() {

    // get default variables prefix
    const prefix = process.env.VAR_PREFIX || 'URL_';

    // get urls from env
    const urls = getUrlsFromEnv(prefix);

    // create routes for urls
    for (let i = 0; i < Object.keys(urls).length; i++) {
        const key = Object.keys(urls)[i]
        const value = urls[key]
        
        let url = `/${value.id}`
        if (value.id == "*") url = `/`
        
        fastify.get(url, async (request, reply) => {
            reply.redirect(value.go)
        })
    }

    // serve
    fastify.listen({port}, (err, address) => {
        if (err) throw err
        console.log(`Server listening on ${port}`)
    })
}

// run app
main()