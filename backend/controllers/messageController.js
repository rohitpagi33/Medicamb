const Message = require('../models/Message');
const Chat = require('../models/Chat');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).send('Invalid data');
  let message = await Message.create({
    sender: req.user.id,
    content,
    chat: chatId,
  });
  message = await message.populate('sender', 'name email');
  message = await message.populate('chat');
  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });
  res.status(201).send(message);
};

exports.allMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate('sender', 'name email')
    .populate('chat');
  res.send(messages);
}; 