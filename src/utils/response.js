

exports.unauthorizedResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify({
            body,
          }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

exports.notFoundResponse = (statusCode, body) =>  {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify({
            body,
          }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

exports.successResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify({
            body,
          }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

exports.errorResponse = (statusCode, body) => {
    const response = {
        statusCode: statusCode,
        body: JSON.stringify({
            body,
          }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return response
}

