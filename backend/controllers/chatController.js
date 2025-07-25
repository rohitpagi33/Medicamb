const Chat = require('../models/Chat');
const User = require('../models/User');

exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).send('UserId param not sent');
  let chat = await Chat.findOne({
    isGroup: false,
    users: { $all: [req.user.id, userId] },
  }).populate('users', '-password').populate('latestMessage');
  if (chat) return res.send(chat);
  chat = await Chat.create({
    chatName: 'sender',
    isGroup: false,
    users: [req.user.id, userId],
  });
  res.status(201).send(chat);
};

exports.fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: { $in: [req.user.id] } })
    .populate('users', '-password')
    .populate('groupAdmin', '-password')
    .populate('latestMessage')
    .sort({ updatedAt: -1 });
  res.send(chats);
};

exports.createGroupChat = async (req, res) => {
  let { users, name } = req.body;
  if (!users || !name) return res.status(400).send('Please fill all fields');
  users = JSON.parse(users);
  if (users.length < 2) return res.status(400).send('More than 2 users required');
  users.push(req.user.id);
  const groupChat = await Chat.create({
    chatName: name,
    users,
    isGroup: true,
    groupAdmin: req.user.id,
  });
  res.status(201).send(groupChat);
};

exports.renameGroup = async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(chatId, { chatName }, { new: true });
  res.send(updatedChat);
};

exports.addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(chatId, { $push: { users: userId } }, { new: true });
  res.send(updatedChat);
};

exports.removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(chatId, { $pull: { users: userId } }, { new: true });
  res.send(updatedChat);
}; 