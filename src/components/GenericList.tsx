import type { ReactNode } from 'react';
import { Fragment } from 'react';

interface GenericListProps<T> {
  items: T[];
  renderItem: (item: T) => ReactNode;
  wrapList?: boolean;
}

export default function GenericList<T extends { id: string; }>({
  items,
  renderItem,
  wrapList = true
}: GenericListProps<T>) {
  const children = items?.map(item => <Fragment key={item.id}>
    {renderItem(item)}
  </Fragment>);
  return wrapList ?
    <section className="list">
      {children}
    </section> :
    <>
      {children}
    </>;
}