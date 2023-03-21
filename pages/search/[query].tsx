import Head from 'next/head';
import { useRouter } from 'next/router';
import { NextPage, GetServerSideProps } from 'next';
import FilterMenu from '../../components/Search/FilterMenu';
import SearchInput from '../../components/Search/SearchInput';
import ImageLayout from '../../components/Search/ImageLayout';
import ScrollToTopButton from '../../components/ScrollToTopButton';
import { useFetch, ResponseImage, fetchImages } from '../../hooks/useFetch';

type Props = {
  searchQuery: string;
  images: ResponseImage[];
  hasMore: boolean;
};

type RouteQuery = {
  query: string;
  o: string;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { query: searchQuery, o: orientation } = query as RouteQuery;
  const searchParams = new URLSearchParams({ e: 'search', q: searchQuery });
  if (orientation) searchParams.append('o', orientation);
  const key = searchQuery + (orientation || '');

  const { newImages, hasMore } = await fetchImages(searchParams);
  return {
    props: { searchQuery, images: newImages, hasMore, key }
  };
};

const SearchResults: NextPage<Props> = ({ searchQuery, images, hasMore }) => {
  const router = useRouter();
  const hasResults = images.length > 0;
  const orientation = (router.query!.o as string) || 'all';
  const configs = {
    endpoint: 'search',
    searchQuery,
    initialImages: images,
    orientation,
    hasMore
  };

  const imageArray = useFetch(configs);
  return (
    <>
      <Head>
        <title>{searchQuery} images | Search and save in your albums</title>
      </Head>
      <div className="px-8">
        <SearchInput value={searchQuery} />
        <div className="max-w-screen-xl mx-auto">
          {hasResults ? (
            <>
              <div className="flex items-center justify-between w-full mb-5">
                <h3 className="font-bold text-2xl lg:text-4xl first-letter:capitalize">
                  {searchQuery} images.
                </h3>
                <FilterMenu query={searchQuery} focusOn={orientation} />
              </div>
              <ImageLayout images={imageArray} />
            </>
          ) : (
            <>
              <h3 className="text-2xl sm:text-3xl lg:text-5xl mb-5 first-letter:capitalize">
                No results for “{searchQuery}”.
              </h3>
              <p className="text-xl sm:text-2xl lg:text-4xl">
                Try another search.
              </p>
            </>
          )}
        </div>
        <ScrollToTopButton />
      </div>
    </>
  );
};
export default SearchResults;
