import axios from 'axios';

let base = '';

export const requestLogin = params => { return axios.post(`${base}/login`, params).then(res => res.data); };

export const getProductList = params => { return axios.get(`${base}/product/list`, { params: params }); };

export const getApprovedProductList = params => { return axios.get(`${base}/product/approvedlist`, { params: params }); };

export const getDisapprovedProductList = params => { return axios.get(`${base}/product/disapprovedlist`, { params: params }); };

export const getProductListPage = params => { return axios.get(`${base}/product/listpage`, { params: params }); };

export const changeStatus = params => { return axios.get(`${base}/product/changeStatus`, { params: params }); };

export const batchChangeStatus = params => { return axios.get(`${base}/product/batchChangeStatus`, { params: params }); };

export const removeProduct = params => { return axios.get(`${base}/product/remove`, { params: params }); };

export const batchRemoveProduct = params => { return axios.get(`${base}/product/batchRemove`, { params: params }); };
