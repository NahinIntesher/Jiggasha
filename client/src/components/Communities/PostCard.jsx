'use client';
import Image from 'next/image';

const getMediaURL = hexBlob => {
  try {
    return Buffer.from(hexBlob.replace('\\x', ''), 'hex').toString();
  } catch {
    return '';
  }
};

export default function PostCard({ post }) {
  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">{post.title}</h2>
        {post.is_pinned && <span className="text-xs bg-yellow-300 px-2 py-1 rounded">Pinned</span>}
      </div>
      <p className="mt-2 text-gray-700">{post.content}</p>

      {post.media.length > 0 && (
        <div className="mt-4">
          {post.media.map(media => {
            const url = getMediaURL(media.media_blob);
            switch (media.media_type) {
              case 'image':
                return <img key={media.media_id} src={url} alt="Post image" className="rounded-lg w-full" />;
              case 'audio':
                return <audio key={media.media_id} controls src={url} className="w-full mt-2" />;
              case 'video':
                return <video key={media.media_id} controls src={url} className="w-full mt-2 rounded-lg" />;
              case 'document':
                return (
                  <a
                    key={media.media_id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline mt-2 block"
                  >
                    View Document
                  </a>
                );
              default:
                return null;
            }
          })}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Views: {post.view_count} | Reactions: {post.reaction_count} | Comments: {post.comment_count}
      </div>
    </div>
  );
}
