module.exports = [

    /* Single issue */
    {
        path: '/api/issue/add',
        method: 'POST',
        query: 'issue'
    },
    {
        path: '/api/issue/get',
        method: 'GET',
        query: 'issue'
    },
    {
        path: '/api/issue/clear/:_id',
        method: 'DELETE',
        query: 'issue'
    },
    {
        path: '/api/issue/put',
        method: 'PUT',
        query: 'issue'
    },

    /* Multiple issues */
    {
        path: '/api/issues/get/:page?',
        method: 'GET',
        query: 'issues'
    },

    /* History update */
    {
        path: '/api/issuelog/put',
        method: 'PUT',
        query: 'issuelog'
    },

    /* Single user */
    {
        path: '/api/user/add',
        method: 'POST',
        query: 'user'
    },
    {
        path: '/api/user/get',
        method: 'GET',
        query: 'user'
    },
    {
        path: '/api/user/clear/:_id',
        method: 'DELETE',
        query: 'user'
    },
    {
        path: '/api/user/put',
        method: 'PUT',
        query: 'user'
    },

    /* Multiple users */
    {
        path: '/api/users/get',
        method: 'GET',
        query: 'users'
    },

    /* Single client */
    {
        path: '/api/client/add',
        method: 'POST',
        query: 'client'
    },
    {
        path: '/api/client/get',
        method: 'GET',
        query: 'client'
    },
    {
        path: '/api/client/clear/:_id',
        method: 'DELETE',
        query: 'client'
    },
    {
        path: '/api/client/put',
        method: 'PUT',
        query: 'client'
    },

    /* Multiple clients */
    {
        path: '/api/clients/get',
        method: 'GET',
        query: 'clients'
    },

    /* Single caller */
    {
        path: '/api/caller/add',
        method: 'POST',
        query: 'caller'
    },
    {
        path: '/api/caller/get',
        method: 'GET',
        query: 'caller'
    },
    {
        path: '/api/caller/clear/:_id',
        method: 'DELETE',
        query: 'caller'
    },
    {
        path: '/api/caller/put',
        method: 'PUT',
        query: 'caller'
    },

    /* Multiple callers */
    {
        path: '/api/callers/get/:query?',
        method: 'GET',
        query: 'callers'
    },

    /* Reports */
    {
        path: '/api/reports/get/:query?',
        method: 'GET',
        query: 'reports'
    }
];