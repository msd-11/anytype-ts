import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RouteComponentProps } from 'react-router';
import { Loader, Block } from 'Component';
import { I } from 'Lib';
import { commonStore } from 'Store';

interface Props extends I.Popup, RouteComponentProps<any> {}; 

const $ = require('jquery');
const Constant = require('json/constant.json');
const BORDER = 16;
const PADDING = 8;

class PopupPreview extends React.Component<Props, {}> {
	
	constructor (props: any) {
		super (props);
	};
	
	render () {
		const { param } = this.props;
		const { data } = param;
		const { rootId, block } = data;
		const { hash } = block.content;

		let content = null;

		switch (block.content.type) {
			case I.FileType.Image:
				content = <img className="media" src={commonStore.imageUrl(hash, Constant.size.image)} />
				break;
		};

		return (
			<div>
				<Loader id="loader" />
				<div id="wrap" className="wrap">
					{content}
				</div>
			</div>
		);
	};
	
	componentDidMount () {
		this.resize();
		this.rebind();
	};
	
	componentDidUpdate () {
		this.resize();
	};

	componentWillUnmount () {
		this.unbind();
	};

	unbind () {
		$(window).off('resize.popupPreview');
	};

	rebind () {
		this.unbind();
		$(window).on('resize.popupPreview', () => { this.resize(); });
	};
	
	resize () {
		const { param, position, getId } = this.props;
		const { data } = param;
		const { block } = data;
		
		const obj = $(`#${getId()}-innerWrap`);
		const win = $(window);
		const node = $(ReactDOM.findDOMNode(this));
		const wrap = node.find('#wrap');
		const loader = node.find('#loader');

		switch (block.content.type) {
			case I.FileType.Image:
				const img = new Image();
				img.onload = function () {
					loader.remove();
					
					let cw = img.width;
					let ch = img.height;
					let mw = win.width() - BORDER * 2;
					let mh = win.height() - BORDER * 2;
					let width = 0, height = 0;
					
					if (cw >= ch) {
						width = Math.min(mw, cw);
						height = Math.min(mh, width / (cw / ch));
					} else {
						height = Math.min(mh, ch);
						width = Math.min(mw, height / (ch / cw));
					};

					wrap.css({ height: height - PADDING * 2, width: width - PADDING * 2 });
					
					position();
				};
				img.src = commonStore.imageUrl(block.content.hash, Constant.size.image);
				break;
		};
		
	};
	
};

export default PopupPreview;