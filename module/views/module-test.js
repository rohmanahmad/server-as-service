const command = document.getElementById('command')
const modelsFn = document.getElementById('models-fn')
const methodFn = document.getElementById('method-fn')
const commandResult = document.getElementById('command-result')

function format() {
    const unformatted = command.value || '{}'
    command.value = JSON.stringify(JSON.parse(unformatted), null, 4)
}

function check() {
    const model = modelsFn.value
    const method = methodFn.value.split('/').reverse()[0]
    let v = null
    delete schemaTemplates[model]['__v']
    if ([
        'find-one',
        'create-one',
        'delete-one',
        'delete-many'
    ].indexOf(method) > -1) {
        v = schemaTemplates[model]
    } else if (method == 'aggregate') {
        v = [ { $match: schemaTemplates[model] } ]
    } else if (method == 'update-one') {
        v = {$criteria: schemaTemplates[model], $update: {$set: {}, $setOnInsert: {}}, $options: {upsert: false}}
    } else if (method == 'update-many') {
        v = {$criteria: schemaTemplates[model], $update: {$set: {}, $setOnInsert: {}}}
    } else if (method == 'create-many') {
        v = [schemaTemplates[model], schemaTemplates[model]]
    } else if (method == 'find-all') {
        v = {
            $criteria: schemaTemplates[model],
            $limit: 10,
            $skip: 0,
            $fields: {}
        }
    }
    if (v) command.value = JSON.stringify(v, null, 4)
}

function send () {
    const unformatted = command.value.trim()
    const body = JSON.stringify(JSON.parse(unformatted))
    const model = modelsFn.value
    const url = methodFn.value.replace(':modelname', model)
    fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json'
        },
        referrerPolicy: 'no-referrer',
        body
    })
    .then(res => {
        if (res && res.json) {
            return res.json()
        }
        return null
    })
    .then(data => {
        commandResult.innerHTML = ''
        commandResult.innerHTML = JSON.stringify(data, null, 4).replace(/\\n/g, '\n\t')
    })
}