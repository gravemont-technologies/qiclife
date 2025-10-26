import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

export default function Social() {
  const [feed, setFeed] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    apiClient.getLeaderboard(20)
      .then((res) => setFeed(res.data.data.leaderboard || []))
      .catch((e) => setError(e?.message || 'Failed to load social feed'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h2>Social</h2>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      <div className="qic-card" style={{ padding: 12 }}>
        <pre style={{ margin: 0 }}>
          {JSON.stringify(feed, null, 2)}
        </pre>
      </div>
    </div>
  );
}


