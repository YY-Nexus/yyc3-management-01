"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Share2, ThumbsUp, Send } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

interface Post {
  id: string
  author: string
  content: string
  timestamp: string
  likes: number
  comments: Comment[]
  shares: number
  type: "announcement" | "discussion" | "achievement" | "social"
}

interface Comment {
  id: string
  author: string
  content: string
  timestamp: string
}

const mockPosts: Post[] = [
  {
    id: "1",
    author: "张三",
    content: "今天完成了一个重要的项目里程碑！感谢团队的支持和配合。💪",
    timestamp: "2小时前",
    likes: 12,
    shares: 3,
    type: "achievement",
    comments: [
      {
        id: "1",
        author: "李四",
        content: "恭喜！辛苦了！",
        timestamp: "1小时前",
      },
      {
        id: "2",
        author: "王五",
        content: "太棒了，向你学习！",
        timestamp: "30分钟前",
      },
    ],
  },
  {
    id: "2",
    author: "人事部",
    content: "📢 公司将于下周五举办团建活动，请大家积极参与！活动地点：阳光山庄，时间：下午2点-6点。",
    timestamp: "4小时前",
    likes: 25,
    shares: 8,
    type: "announcement",
    comments: [
      {
        id: "3",
        author: "赵六",
        content: "太好了！期待团建活动！",
        timestamp: "3小时前",
      },
    ],
  },
]

export default function GroupInteractions() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [newPost, setNewPost] = useState("")
  const [newComment, setNewComment] = useState<{ [key: string]: string }>({})

  const getPostTypeColor = (type: string) => {
    const colors = {
      announcement: "bg-blue-100 text-blue-800",
      discussion: "bg-green-100 text-green-800",
      achievement: "bg-purple-100 text-purple-800",
      social: "bg-orange-100 text-orange-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const getPostTypeLabel = (type: string) => {
    const labels = {
      announcement: "公告",
      discussion: "讨论",
      achievement: "成就",
      social: "社交",
    }
    return labels[type] || "其他"
  }

  const handleLike = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post)))
  }

  const handleComment = (postId: string) => {
    const commentContent = newComment[postId]
    if (!commentContent?.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      author: "当前用户",
      content: commentContent,
      timestamp: "刚刚",
    }

    setPosts(posts.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, comment] } : post)))

    setNewComment({ ...newComment, [postId]: "" })
  }

  const handleShare = (postId: string) => {
    setPosts(posts.map((post) => (post.id === postId ? { ...post, shares: post.shares + 1 } : post)))
  }

  const addPost = () => {
    if (!newPost.trim()) return

    const post: Post = {
      id: Date.now().toString(),
      author: "当前用户",
      content: newPost,
      timestamp: "刚刚",
      likes: 0,
      shares: 0,
      type: "discussion",
      comments: [],
    }

    setPosts([post, ...posts])
    setNewPost("")
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">今日互动</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">点赞、评论、分享</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">活跃用户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42</div>
            <p className="text-xs text-muted-foreground">今日发帖用户</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">新增帖子</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-xs text-muted-foreground">今日新帖</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">参与度</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">员工参与率</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>发布动态</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="分享你的想法..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              rows={3}
            />
            <div className="flex justify-between items-center">
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  📷 图片
                </Button>
                <Button variant="outline" size="sm">
                  📎 文件
                </Button>
                <Button variant="outline" size="sm">
                  😊 表情
                </Button>
              </div>
              <Button onClick={addPost} disabled={!newPost.trim()}>
                <Send className="w-4 h-4 mr-2" />
                发布
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${post.author}&background=random`} />
                  <AvatarFallback>{post.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-medium text-sm">{post.author}</h3>
                    <Badge className={`text-xs ${getPostTypeColor(post.type)}`}>{getPostTypeLabel(post.type)}</Badge>
                    <span className="text-xs text-gray-500">{post.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-800 mb-3">{post.content}</p>

                  <div className="flex items-center space-x-4 mb-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleLike(post.id)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <ThumbsUp className="w-4 h-4 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      {post.comments.length}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleShare(post.id)}
                      className="text-gray-500 hover:text-green-500"
                    >
                      <Share2 className="w-4 h-4 mr-1" />
                      {post.shares}
                    </Button>
                  </div>

                  {post.comments.length > 0 && (
                    <div className="space-y-2 mb-3">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="bg-gray-50 p-2 rounded">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-xs">{comment.author}</span>
                            <span className="text-xs text-gray-500">{comment.timestamp}</span>
                          </div>
                          <p className="text-xs text-gray-700">{comment.content}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Input
                      placeholder="写评论..."
                      value={newComment[post.id] || ""}
                      onChange={(e) => setNewComment({ ...newComment, [post.id]: e.target.value })}
                      className="flex-1 text-sm"
                    />
                    <Button size="sm" onClick={() => handleComment(post.id)} disabled={!newComment[post.id]?.trim()}>
                      评论
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
