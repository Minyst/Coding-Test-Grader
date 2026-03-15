import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t py-6 mt-auto">
      <div className="container mx-auto flex flex-col items-center gap-2 px-4 text-sm text-muted-foreground">
        <div className="flex gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            AlgoViz
          </Link>
          <Link href="/learn" className="hover:text-foreground transition-colors">
            학습하기
          </Link>
          <Link href="/visualize" className="hover:text-foreground transition-colors">
            시각화
          </Link>
        </div>
        <p>&copy; 2026 AlgoViz. 비전공자를 위한 알고리즘 학습 플랫폼.</p>
      </div>
    </footer>
  );
}
