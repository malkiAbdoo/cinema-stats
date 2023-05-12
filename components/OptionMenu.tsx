import { motion, AnimatePresence } from 'framer-motion';
import { FC, ReactElement, ReactNode, Children } from 'react';

const transition = { type: 'tween', duration: 0.1 };
const menuVarinats = {
  hidden: { opacity: 0, transition },
  visible: { opacity: 1, transition }
};

type OptionListProps = MenuProps;

const OptionList: FC<OptionListProps> = props => {
  const { focusOn, children, onItemClick } = props;
  const container = Children.toArray(children)[0] as ReactElement;
  return (
    <ul>
      {Children.toArray(container.props.children).map((option, index) => (
        <div
          key={index}
          onClick={onItemClick}
          className={
            'menu-option ' +
            (index == focusOn
              ? 'dark:text-dark dark:bg-white bg-neutral-200'
              : 'bg-white dark:bg-neutral-900 dark:hover:bg-neutral-800 hover:bg-neutral-200')
          }
        >
          {option}
        </div>
      ))}
    </ul>
  );
};

type ClickFunction = (e: any) => void;
type MenuProps = {
  isOpen: boolean;
  focusOn?: number;
  children: ReactNode;
  onClick?: ClickFunction;
  onItemClick?: ClickFunction;
};

const OptionMenu: FC<MenuProps> = props => {
  return (
    <AnimatePresence>
      {props.isOpen && (
        <motion.div
          onClick={props.onClick}
          className="absolute top-full translate-y-2 right-0 z-10 shadow-3xl"
          variants={menuVarinats}
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          <OptionList {...props} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
export default OptionMenu;