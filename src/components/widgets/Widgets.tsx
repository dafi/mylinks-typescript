import React from 'react';
import {ThemeContext} from '../../common/ThemeContext';
import { openAllLinks, Link as MLLink, Widget as MLWidget } from '../../model/MyLinks';

export interface LinkProps { value: MLLink }

class Link extends React.Component<LinkProps, {}> {
  render() {
    const theme = this.context;
    const item = this.props.value;

    const style = {
      visibility: theme.hideShortcuts ? 'collapse' : 'visible'
    } as React.CSSProperties;
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="ml-widget-item-link">
        {this.image(item)}
        <div className="label">{item.label}
        <span className="description" style={style}>
            {item.description}
        </span>
        </div>
      </a>
    );
  }

  image(item: MLLink) {
    if (item.favicon) {
      return <i className="ml-favicon"><img src={item.favicon} alt=''/></i>;
    }
    return <i className="ml-favicon"><div className="ml-missing-favicon" /></i>;
  }
}

Link.contextType = ThemeContext;

export interface WidgetProps { value: MLWidget }

class Widget extends React.Component<WidgetProps, {}> {
  render() {
    const data = this.props.value;
    const items = data.list.map(v => <li key={v.url}> <Link value={v} /> </li>);
    return (
      <div className="ml-widget" data-list-id={data.id}>
        <div className="ml-widget-label">
          <h2>{data.title}</h2>
          <span className="ml-toolbar" onClick={ () => openAllLinks(data)}>
            <i className="fa fa-external-link-alt"></i>
          </span>
        </div>
        <ul>{ items }</ul>
      </div>);
  }
}

export interface ColumnProps { value: MLWidget[] }

class Column extends React.Component<ColumnProps, {}> {
  render() {
    const widgets = this.props.value.map(widget => <Widget key={widget.id} value={widget} />);
    return <section className="ml-rows">{widgets}</section>;
  }
}

export interface GridProps { columns: [MLWidget[]] }

export class Grid extends React.Component<GridProps, {}> {
  render() {
    const widgets = this.props.columns || [];
    const columns = widgets.map((columns: MLWidget[], index: number) => <Column key={index} value={columns}/>);
    return <section className="ml-columns">{columns}</section>;
  }  
}
