import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { api } from "../utils/api";
import { ArrowLeft, Trophy, Medal, Award, TrendingUp } from "lucide-react";

interface LeaderboardProps {
  onBack: () => void;
}

export const Leaderboard = ({ onBack }: LeaderboardProps) => {
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const response = await api.getLeaderboard();
      setLeaderboard(response.leaderboard || []);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="w-6 h-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />;
    if (rank === 3) return <Medal className="w-6 h-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Badge className="bg-yellow-500">1st</Badge>;
    if (rank === 2) return <Badge className="bg-gray-400">2nd</Badge>;
    if (rank === 3) return <Badge className="bg-amber-600">3rd</Badge>;
    return <Badge variant="outline">#{rank}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h1 className="mb-2">Global Leaderboard</h1>
            <p className="text-gray-600">Top performers across all interview practices</p>
          </div>

          {/* Top 3 Podium */}
          {leaderboard.length >= 3 && (
            <div className="grid grid-cols-3 gap-4 mb-8">
              {/* 2nd Place */}
              <Card className="p-6 text-center mt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-3">
                  <Medal className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="mb-1">{leaderboard[1].name}</h4>
                <p className="text-2xl mb-2">{leaderboard[1].totalPoints}</p>
                <p className="text-sm text-gray-600">points</p>
                <Badge className="bg-gray-400 mt-3">2nd Place</Badge>
              </Card>

              {/* 1st Place */}
              <Card className="p-6 text-center border-2 border-yellow-400 bg-gradient-to-b from-yellow-50 to-white">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-3">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
                <h4 className="mb-1">{leaderboard[0].name}</h4>
                <p className="text-3xl mb-2">{leaderboard[0].totalPoints}</p>
                <p className="text-sm text-gray-600">points</p>
                <Badge className="bg-yellow-500 mt-3">1st Place</Badge>
              </Card>

              {/* 3rd Place */}
              <Card className="p-6 text-center mt-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-3">
                  <Medal className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="mb-1">{leaderboard[2].name}</h4>
                <p className="text-2xl mb-2">{leaderboard[2].totalPoints}</p>
                <p className="text-sm text-gray-600">points</p>
                <Badge className="bg-amber-600 mt-3">3rd Place</Badge>
              </Card>
            </div>
          )}

          {/* Full Leaderboard Table */}
          <Card className="p-6">
            <h3 className="mb-6">All Rankings</h3>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry: any, index: number) => (
                  <div 
                    key={entry.userId}
                    className={`flex items-center justify-between p-4 rounded-lg transition-colors ${
                      index < 3 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50' 
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 text-center">
                        {getRankIcon(entry.rank) || (
                          <span className="text-xl">{entry.rank}</span>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4>{entry.name}</h4>
                          {index < 3 && getRankBadge(entry.rank)}
                        </div>
                        {entry.recentSessionScore && (
                          <p className="text-sm text-gray-600">
                            Recent score: {entry.recentSessionScore.toFixed(0)}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <Award className="w-5 h-5 text-blue-600" />
                        <span className="text-2xl">{entry.totalPoints}</span>
                      </div>
                      <p className="text-sm text-gray-600">total points</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No leaderboard entries yet. Be the first!</p>
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="p-6 mt-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="mb-2">How Points Are Calculated</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Base points: 100 per session</li>
                  <li>• Multiplied by your interview score (0-100)</li>
                  <li>• Difficulty multipliers: Easy (1.0x), Medium (1.2x), Hard (1.5x)</li>
                  <li>• Keep practicing to climb the leaderboard!</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
