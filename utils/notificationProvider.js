const FCM = require('fcm-node');
const catchAsync = require('./catchAsync');

exports.sendNotification = catchAsync(async (req, res, next) => {
  const serverKey =
    'AAAA0g5sWhk:APA91bHVuozOhYJ2LHifo_RJxqlu8Aket_N-p4lDyS7TpoUWSXuTa2SqrUZViqDnYkalVihOBQVoRRFakY6bPzyhmC8qL0EXTiJ_5djpsrn-Q8RFzBTAe_HdOI3lc9Vw2bg0XX-cmj5E';
  const fcm = new FCM(serverKey);

  const tokens = req.colaborator.token.concat(req.client.token);

  //console.log(tokens);

  const message = {
    registration_ids: tokens,
    //collapse_key: 'your_collapse_key',
    notification: {
      title: req.contentTitle,
      body: req.contentBody,
    },
    data: {
      my_key: 'my value',
      my_another_key: 'my another value',
    },
  };

  await fcm.send(message, function (err, response) {
    if (err) {
      res.status(200).json({
        status: 'fail',
        err,
      });
    } else {
      res.status(200).json({
        status: 'success',
      });
    }
  });
});
