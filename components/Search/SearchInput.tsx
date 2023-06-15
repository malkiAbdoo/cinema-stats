import { FC, useEffect, useState } from 'react';
import { CgSearch as SearchIcon } from 'react-icons/cg';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useSearchTrigger } from '@/hooks/useSearchTrigger';
import { cn } from '@/utils';

function storeInHistory(searchValue?: string) {
  const searchHistory = localStorage.getItem('search_history') || '[]';
  const historyValues = JSON.parse(searchHistory) as string[];
  const historyLimit = 5;

  const index = historyValues.indexOf(searchValue as string);
  if (index > -1) historyValues.splice(index, 1);
  else if (historyValues.length == historyLimit) historyValues.pop();

  const newHistory = JSON.stringify([searchValue, ...historyValues]);
  localStorage.setItem('search_history', newHistory);
}

type SuggestionsMenuProps = {
  value: string;
  onClick: (searchText: string) => void;
};

const SuggestionsMenu: FC<SuggestionsMenuProps> = ({ value, onClick }) => {
  const searchHistory = useSearchHistory(value);
  const [focusIndex, setFocusIndex] = useState<number>(-1);

  function handleKeyDown({ key }: any) {
    if (key == 'Enter' && focusIndex > -1) {
      onClick(searchHistory[focusIndex]);
      return;
    }

    const isUpKey = key == 'ArrowUp';
    const isDownKey = key == 'ArrowDown';
    if (!isUpKey && !isDownKey) return;

    const canGoUp = isUpKey && focusIndex > 0;
    const canGoDown = isDownKey && focusIndex < searchHistory.length - 1;
    const direction = focusIndex == -1 ? 1 : canGoUp ? -1 : canGoDown ? 1 : 0;

    setFocusIndex(focusIndex + direction);
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  });

  return (
    <div className="absolute left-0 top-full z-[101] hidden w-full translate-y-3 group-focus-within:block">
      <ul className="w-full rounded-xl shadow-3xl">
        {searchHistory.map((searchValue, index) => (
          <li
            key={index}
            className={cn('menu-suggestion', { 'focus': focusIndex == index })}
            onMouseEnter={() => setFocusIndex(index)}
            onMouseDown={() => onClick(searchValue)}
            onMouseLeave={() => setFocusIndex(-1)}
            onKeyDown={handleKeyDown}
          >
            <SearchIcon size={21} />
            <span className="inline-block overflow-hidden text-ellipsis whitespace-nowrap">
              {searchValue}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

type InputProps = {
  value?: string;
};
const SearchInput: FC<InputProps> = ({ value }) => {
  const [inputValue, setInputValue] = useState<string>(value || '');
  const { inputRef, triggerTheSearch, handleEnter } = useSearchTrigger(storeInHistory);

  function handleMouseClick(searchText: string) {
    setInputValue(searchText);
    triggerTheSearch(searchText);
  }

  return (
    <div className="mx-auto px-4 pt-20 text-center sm:pt-28">
      <h2>
        Search for <span className="theme-gradient bg-clip-text text-transparent">images</span>
      </h2>
      <div className="bg-cs-change group relative mx-auto my-7 flex max-w-[730px] items-center rounded-3xl text-lg shadow-lg transition-colors">
        <input
          type="search"
          ref={inputRef}
          value={inputValue}
          placeholder="Search.."
          className="h-full flex-grow bg-transparent px-4 py-2 outline-none"
          onInput={e => setInputValue(e.currentTarget.value)}
          onKeyDown={handleEnter}
          autoComplete="off"
          required
        />
        <button
          className="theme-btn rounded-inherit px-5 py-2 sm:px-7"
          onClick={() => triggerTheSearch()}
        >
          <SearchIcon size={30} className="inline text-center" />
        </button>
        <SuggestionsMenu value={inputValue} onClick={handleMouseClick} />
      </div>
    </div>
  );
};
export default SearchInput;
