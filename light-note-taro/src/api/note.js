import request from '../utils/request';

export const getNotes = (params) => {
    return request({
        url: '/notes',
        method: 'GET',
        data: params,
    });
};

export const getNote = (id) => {
    return request({
        url: `/notes/${id}`,
        method: 'GET',
    });
};

export const createNote = (data) => {
    return request({
        url: '/notes',
        method: 'POST',
        data,
    });
};

export const updateNote = (id, data) => {
    return request({
        url: `/notes/${id}`,
        method: 'PUT',
        data,
    });
};

export const deleteNote = (id) => {
    return request({
        url: `/notes/${id}`,
        method: 'DELETE',
    });
};

export const deleteNotesBatch = (ids) => {
    return request({
        url: '/notes/batch',
        method: 'DELETE',
        data: { ids },
    });
};
