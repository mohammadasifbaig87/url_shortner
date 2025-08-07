import { useState, useEffect } from 'react';
import axios from 'axios';
import QRCode from "react-qr-code";



function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('shortLinks');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('shortLinks', JSON.stringify(history));
  }, [history]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setShortUrl('');
    try {
      const res = await axios.post('http://localhost:5000/shorten', {
        originalUrl: url,
      });
      setShortUrl(res.data.shortUrl);
      setHistory((prev) => [res.data.shortUrl, ...prev]);
      setUrl('');
    } catch (err) {
      alert('Failed to shorten URL');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      alert('Copied to clipboard!');
    } catch {
      alert('Copy failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">URL Shortener</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter your long URL"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Shorten URL
          </button>
        </form>

        {shortUrl && (
          <div className="mt-6 text-center">
            <p className="text-gray-600 mb-2">Shortened URL:</p>
            <div className="flex flex-col items-center space-y-2">
              <a
                href={shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {shortUrl}
              </a>
              <button
                onClick={handleCopy}
                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              >
                Copy
              </button>
              <QRCode value={shortUrl} size={120} className="mt-2" />
            </div>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-10 w-full max-w-md bg-white p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">History</h2>
          <ul className="space-y-2 text-blue-600">
            {history.map((link, idx) => (
              <li key={idx}>
                <a href={link} target="_blank" rel="noopener noreferrer" className="underline break-all">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
