const Axios = require("axios");

export const callPostAPI = (service, reqObj) => {
  return new promises((resolve, reject) => {
    Axios.post(service, JSON.stringify(reqObj))
      .then((res) => {
        resolve(res);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const callGetAPI = (service,headerConfig) => {
    return new promises((resolve, reject) => {
      Axios.get(service,headerConfig)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
