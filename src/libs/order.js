import {
  isSaleOrder,
  cancelOrder,
  takeOrder,
  delOrder,
  payOrder,
  isPayOrder,
  isApplySale
} from "@api/order";
import dialog from "@utils/dialog";
import { pay } from "@libs/wechat";

export function cancelOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认取消该订单?",
      opts() {
        cancelOrder(orderId)
          .then(res => {
            dialog.success("取消成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error("取消失败");
            reject(err);
          });
      }
    });
  });
}

export function takeOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    takeOrder(orderId)
      .then(res => {
        dialog.success("收货成功");
        resolve(res);
      })
      .catch(err => {
        dialog.error("收货失败");
        reject(err);
      });
  });
}

export function delOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认删除该订单?",
      opts() {
        delOrder(orderId)
          .then(res => {
            dialog.success("删除成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error("删除失败");
            reject(err);
          });
      }
    });
  });
}

export function payOrderHandle(orderId, type, from) {
  return new Promise((resolve, reject) => {
    dialog.loading.open("");
    payOrder(orderId, type, from)
      .then(res => {
        const data = res.data;
        dialog.loading.close();
        switch (data.status) {
          case "WECHAT_H5_PAY":
            reject(data);
            setTimeout(() => {
              location.replace(data.result.jsConfig.mweb_url);
            }, 100);
            break;
          case "ORDER_EXIST":
          case "EXTEND_ORDER":
          case "PAY_ERROR":
          case "PAY_DEFICIENCY":
            dialog.toast({ mes: res.msg });
            reject(data);
            break;
          case "SUCCESS":
            dialog.success(res.msg);
            resolve(data);
            break;
          case "WECHAT_PAY":
            pay(data.result.jsConfig).then(() => {
              resolve(data);
            });
        }
      })
      .catch(err => {
        dialog.loading.close();
        dialog.toast({ mes: err.msg || "订单支付失败" });
      });
  });
}

//支付申请
export function isPayOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认已经扫码付款，申请已支付？",
      opts() {
        isPayOrder(orderId)
          .then(res => {
            dialog.success("操作成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error(err.msg);
            reject(err);
          });
      }
    });
  });
}

export function isApplySaleHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "申请该订单的商品继售？",
      opts() {
        isApplySale(orderId)
          .then(res => {
            dialog.success("操作成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error(err.msg);
            reject(err);
          });
      }
    });
  });
}

export function isSaleOrderHandle(orderId) {
  return new Promise((resolve, reject) => {
    dialog.confirm({
      mes: "确认收到继售订单商品资金？",
      opts() {
        isSaleOrder(orderId)
          .then(res => {
            dialog.success("操作成功");
            resolve(res);
          })
          .catch(err => {
            dialog.error(err.msg);
            reject(err);
          });
      }
    });
  });
}
