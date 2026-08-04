import { EmptyState } from "@/components/empty-state/empty-state";
import { PageHeaderWithImage } from "@/components/page-header";
import { StudyRiddlesPagination } from "@/features/study/components/study-riddles-pagination";
import { loadStudyRiddles } from "@/features/study/loaders/study-riddles-page.loader";
import { getStudyCoverImageSrc } from "@/features/study/utilities/study-cover-image.utils";
import { getPaginationParams } from "@/features/study/utilities/study-riddles-pagination.utils";
import { RiddleBoardCard } from "@/features/riddle/components/riddle-board-card";
import { getPublicUser } from "@/lib/supabase/auth";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function StudyDetailPage({ params, searchParams }: Props) {
  const { user, supabase } = await getPublicUser();
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = getPaginationParams(pageParam);

  // ==================================================================
  // Getting all study riddles from loader
  // ==================================================================
  const { study, studyRiddles, pagination } = await loadStudyRiddles({
    supabase,
    user,
    slug,
    pagination: page,
  });

  return (
    <div className="page-container">
      <div className="page-container-children-layout">
        {/* Page Header with Study Image */}
        <PageHeaderWithImage
          title={study.title}
          description={study.description}
          imageSrc={getStudyCoverImageSrc(study.coverImageUrl)}
        />

        {/* Check If there are studies, if not, empty state */}
        {pagination?.totalRiddleCount === 0 && <EmptyState message="No riddles found in this study." />}

        {/* If there are studies, display them in a grid */}
        <div className="page-container-grid-data-layout">
          {studyRiddles.map(({ riddle, game, href, displayFen, accuracyPercent, primaryTheme, isComplete }) => (
            <RiddleBoardCard
              key={riddle.id}
              riddle={riddle}
              game={game}
              boardWrapperClassName="aspect-square w-[180px] shrink-0"
              href={href}
              displayFen={displayFen}
              accuracyPercent={accuracyPercent}
              primaryTheme={primaryTheme}
              isComplete={isComplete}
            />
          ))}
        </div>

        {/* If there are studies and pages, display the pagination navigator */}
        {pagination ? (
          <StudyRiddlesPagination
            basePath={`/study/${slug}`}
            page={pagination.page}
            totalPages={pagination.totalPages}
          />
        ) : null}
      </div>
    </div>
  );
}
