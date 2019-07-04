import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: 'ADMIN'
  }
];




const Products = [];
axios
  .get('https://18.219.121.53:8080/product/review/list/all')
  .then(function(info){
    for(let i = 0; i < info.data.length; i++){
      Products.push({
        number: i,
        id: info.data[i].id.toString(),
        sku: info.data[i].sku,
        rate: info.data[i].rating,
        date: info.data[i].dateUpdated,
        description: info.data[i].description,
        status: info.data[i].status
      });
    }
  })
  .catch(function (error) { // 请求失败处理
    console.log(error);
  });



export { LoginUsers, Products };
