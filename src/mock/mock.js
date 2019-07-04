import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { LoginUsers, Products } from './data/product';
let _Products = Products;

export default {
  /**
   * mock bootstrap
   */
  bootstrap() {
    let mock = new MockAdapter(axios);

    // mock success request
    mock.onGet('/success').reply(200, {
      msg: 'success'
    });

    // mock error request
    mock.onGet('/error').reply(500, {
      msg: 'failure'
    });

    //登录
    mock.onPost('/login').reply(config => {
      let {username, password} = JSON.parse(config.data);
      return new Promise((resolve, reject) => {
        let user = null;
        setTimeout(() => {
          let hasUser = LoginUsers.some(u => {
            if (u.username === username && u.password === password) {
              user = JSON.parse(JSON.stringify(u));
              user.password = undefined;
              return true;
            }
          });

          if (hasUser) {
            resolve([200, { code: 200, msg: 'request success', user }]);
          } else {
            resolve([200, { code: 500, msg: 'Wrong username or password' }]);
          }
        }, 1000);
      });
    });

    //获取待定产品列表
    mock.onGet('/product/list').reply(config => {
      let {id} = config.params;
      let mockProducts = _Products.filter(product => {
        if (id && product.id.indexOf(id) == -1 || product.status != 0) return false;
        return true;
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            products: mockProducts
          }]);
        }, 1000);
      });
    });

    //获取许可产品列表
    mock.onGet('/product/approvedlist').reply(config => {
      let {page, id} = config.params;
      let mockProducts = _Products.filter(product => {
        if (id && product.id.indexOf(id) == -1 || product.status != 1) return false;
        return true;
      });
      let total = mockProducts.length;
      mockProducts = mockProducts.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            products: mockProducts
          }]);
        }, 1000);
      });
    });

    //获取不许可产品列表
    mock.onGet('/product/disapprovedlist').reply(config => {
      let {page, id} = config.params;
      let mockProducts = _Products.filter(product => {
        if (id && product.id.indexOf(id) == -1 || product.status != 2) return false;
        return true;
      });
      let total = mockProducts.length;
      mockProducts = mockProducts.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            products: mockProducts
          }]);
        }, 1000);
      });
    });

    //获取产品列表（分页）
    mock.onGet('/product/listpage').reply(config => {
      let {page, id} = config.params;
      let mockProducts = _Products.filter(product => {
        if (id && product.id.indexOf(id) == -1 || product.status != 0) return false;
        return true;
      });
      let total = mockProducts.length;
      mockProducts = mockProducts.filter((u, index) => index < 20 * page && index >= 20 * (page - 1));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            total: total,
            products: mockProducts
          }]);
        }, 1000);
      });
    });

    //change status
    mock.onGet('/product/changeStatus').reply(config => {
      let { number, status } = config.params;
      _Products.some(u => {
        if (u.number === number) {
          u.status = status;
          return true;
        }
      });
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'Success'
          }]);
        }, 500);
      });
    });



    //删除用户
    mock.onGet('/product/remove').reply(config => {
      let { number } = config.params;
      _Products = _Products.filter(u => u.number !== number);
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'Delete success'
          }]);
        }, 500);
      });
    });

    //批量删除产品
    mock.onGet('/product/batchRemove').reply(config => {
      let { numbers } = config.params;
      numbers = numbers.split(',');
      _Products = _Products.filter(u => !numbers.includes(u.number));
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'Delete success'
          }]);
        }, 500);
      });
    });

    mock.onGet('/product/batchChangeStatus').reply(config => {
      let { numbers, status } = config.params;
      numbers = numbers.split(',');
      for(var i = 0; i < numbers.length; i++){
        _Products.some(u => {
          if (u.number === numbers[i]) {
            u.status = u.status + status;
            return true;
          }
        });
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve([200, {
            code: 200,
            msg: 'Success'
          }]);
        }, 500);
      });
    });
  }
};
