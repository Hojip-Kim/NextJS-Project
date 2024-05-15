import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData() {
  // posts 파일 이름 잡아주기
  const fileNames = fs.readdirSync(postsDirectory);
  // ['pre-rendering.md' , ...]

  const allPostsData = fileNames.map((fileNames) => {
    const id = fileNames.replace(/\.md$/, '');

    const fullPath = path.join(postsDirectory, fileNames);

    const fileContents = fs.readFileSync(fullPath, 'utf-8');

    const matterResults = matter(fileContents);

    // console.log(matterResults);

    return {
      id,
      ...(matterResults.data as { date: string; title: string }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

export function getAllPostIds() {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map((fileNames) => {
    return {
      params: {
        id: fileNames.replace(/\.md$/, ''),
      },
    };
  });
}

export async function getPostData(id: string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf-8');

  const matterResults = matter(fileContents);

  const processedContent = await remark()
    .use(remarkHtml)
    .process(matterResults.content);

  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResults.data as { date: string; title: string }),
  };
}
