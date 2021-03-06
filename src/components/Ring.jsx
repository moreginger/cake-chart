import React, { Component, PropTypes } from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Slice from './Slice';
import SliceLabel from './SliceLabel';
import getDefaultColor from '../utils/getDefaultColor';
import useSheet from 'react-jss';
import classNames from 'classnames';

@useSheet({
  sliceActive: {
    cursor: 'pointer'
  }
})
export default class Ring extends Component {
  static propTypes = {
    stroke: Slice.propTypes.stroke,
    strokeWidth: Slice.propTypes.strokeWidth,
    sliceRadiusRange: Slice.propTypes.sliceRadiusRange,
    onClick: Slice.propTypes.onClick,
    getTitle: PropTypes.func,
    getLabel: PropTypes.func,

    level: PropTypes.number.isRequired,
    center: PropTypes.number.isRequired,
    className: PropTypes.string.isRequired,
    getSliceProps: PropTypes.func.isRequired,
    slices: PropTypes.array.isRequired
  }

  shouldComponentUpdate = shouldPureComponentUpdate

  render() {
    const { slices, level, sliceRadiusRange, center, stroke, strokeWidth,
            onClick, getTitle, getLabel, className, getSliceProps, sheet: { classes } } = this.props;
    const rectSize = sliceRadiusRange.end + 20;
    const hasChildren = s => s.node.children && s.node.children.length > 0;
    const slicesProps = slices.map((slice, idx) => {
      return getSliceProps(slice, idx, {
        key: idx,
        node: slice.node,
        angleRange: { start: slice.start, end: slice.end },
        percentValue: slice.percentValue.toFixed(1),
        fill: getDefaultColor(level, idx),
        className: classNames({
          [classes.sliceActive]: hasChildren(slice),
          [classes.slice]: true
        }),
        stroke, strokeWidth, sliceRadiusRange, onClick, level,
        title: getTitle(slice, slice.node.title),
        label: getLabel(slice, slice.node.label)
      });
    });

    return (
      <g className={className}>
        {slicesProps.map(sliceProps => {
          return <Slice {...sliceProps} />;
        })}
        {slicesProps.map(sliceProps => {
          return <SliceLabel {...sliceProps} />;
        })}
      </g>
    );
  }
}
