import Head from 'next/head';
import { FC, useState } from 'react';
import { NextPage, GetServerSideProps } from 'next';
import { fetchImages } from '../../utils/fetchImages';
import { withRouter, NextRouter } from 'next/router';
import { useInfinitScroll, ResponseImage } from '../../hooks/useInfinitScroll';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import {
  FilterMenu,
  ImageGridLayout,
  SearchInput
} from '../../components/Search';

type Props = {
  searchQuery: string;
  images: ResponseImage[];
  hasMore: boolean;
  router: NextRouter;
};

type RouteQuery = {
  query: string;
  o: string;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { query: searchQuery, o: orientation } = query as RouteQuery;
  const searchParams: Record<string, string> = { e: 'search', q: searchQuery };
  if (orientation) searchParams.o = orientation;

  const { images, hasMore } = await fetchImages(searchParams);
  const key = searchQuery + (orientation || '');

  return {
    props: { searchQuery, images, hasMore, key }
  };
};

const NoResults: FC<{ query: string }> = ({ query }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl sm:text-3xl lg:text-5xl mb-5">
        No results for “{query}”.
      </h3>
      <p className="text-xl sm:text-2xl lg:text-4xl">Try another search.</p>
    </div>
  );
};

const SearchResultsPage: NextPage<Props> = props => {
  const { searchQuery, images, hasMore, router } = props;

  const hasResults = images.length > 0;
  const orientation = (router.query!.o as string) || 'all';
  const params = {
    endpoint: 'search',
    searchQuery,
    initialImages: images,
    orientation,
    hasMore
  };

  const imageArray = useInfinitScroll(params);
  const [currentPathname, _] = useState<string>(router.asPath);

  const title = searchQuery + ' images | Search and save in your albums';

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div>
        <SearchInput value={searchQuery} />
        <div className="max-w-screen-xl mx-auto bg-cs-change p-4 rounded-3xl">
          {hasResults ? (
            <>
              <div className="flex items-center justify-between w-full mb-5">
                <h3 className="font-bold text-2xl lg:text-4xl first-letter:capitalize">
                  {searchQuery} images.
                </h3>
                <FilterMenu query={searchQuery} focusOn={orientation} />
              </div>
              <ImageGridLayout pagePath={currentPathname} images={imageArray} />
            </>
          ) : (
            <NoResults query={searchQuery} />
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};
export default withRouter(SearchResultsPage);
