const Url = require('../schema/Url');
const isValidUrl = require('../helpers/validateUrl');
const { nanoid } = require('nanoid');

const shortenUrl = async (req, res) => {
  const { url } = req.body;

  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  try {
    let existing = await Url.findOne({ originalUrl: url });
    if (existing) {
      return res.json({ shortUrl: `${process.env.BASE_URL}/${existing.shortCode}` });
    }

    const code = nanoid(6);
    const newUrl = new Url({ originalUrl: url, shortCode: code });
    await newUrl.save();

    res.status(201).json({ shortUrl: `${process.env.BASE_URL}/${code}` });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

const redirectUrl = async (req, res) => {
  const { code } = req.params;

  try {
    const found = await Url.findOne({ shortCode: code });

    if (!found) {
      return res.status(404).json({ error: 'URL not found' });
    }

    found.clickCount += 1;
    await found.save();

    res.redirect(found.originalUrl);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { shortenUrl, redirectUrl };
