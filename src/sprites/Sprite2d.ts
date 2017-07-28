namespace pixi_projection {
	export class Sprite2d extends PIXI.Sprite {
		constructor(texture: PIXI.Texture) {
			super(texture);
			this.proj = new Projection2d(this.transform);
			this.pluginName = 'sprite2d';
		}

		proj: Projection2d;

		/**
		 * calculates worldTransform * vertices, store it in vertexData
		 */
		calculateVertices() {
			const wid = (this.transform as any)._worldID;
			const tuid = (this._texture as any)._updateID;
			if (this._transformID === wid && this._textureID === tuid) {
				return;
			}

			this._transformID = wid;
			this._textureID = tuid;

			// set the vertex data

			const texture = this._texture;
			const wt = this.proj.world.mat3;
			const vertexData = this.vertexData;
			const trim = texture.trim;
			const orig = texture.orig;
			const anchor = this._anchor;

			let w0 = 0;
			let w1 = 0;
			let h0 = 0;
			let h1 = 0;

			if (trim) {
				// if the sprite is trimmed and is not a tilingsprite then we need to add the extra
				// space before transforming the sprite coords.
				w1 = trim.x - (anchor._x * orig.width);
				w0 = w1 + trim.width;

				h1 = trim.y - (anchor._y * orig.height);
				h0 = h1 + trim.height;
			}
			else {
				w1 = -anchor._x * orig.width;
				w0 = w1 + orig.width;

				h1 = -anchor._y * orig.height;
				h0 = h1 + orig.height;
			}

			let z = 1.0 / (wt[2] * w1 + wt[5] * h1 + wt[8]);
			vertexData[0] = z * ((wt[0] * w1) + (wt[3] * h1) + wt[6]);
			vertexData[1] = z * ((wt[1] * w1) + (wt[4] * h1) + wt[7]);

			z = 1.0 / (wt[2] * w0 + wt[5] * h1 + wt[8]);
			vertexData[2] = z * ((wt[0] * w0) + (wt[3] * h1) + wt[6]);
			vertexData[3] = z * ((wt[1] * w0) + (wt[4] * h1) + wt[7]);

			z = 1.0 / (wt[2] * w0 + wt[5] * h0 + wt[8]);
			vertexData[4] = z * ((wt[0] * w0) + (wt[3] * h0) + wt[6]);
			vertexData[5] = z * ((wt[1] * w0) + (wt[4] * h0) + wt[7]);

			z = 1.0 / (wt[2] * w1 + wt[5] * h0 + wt[8]);
			vertexData[6] = z * ((wt[0] * w0) + (wt[3] * h0) + wt[6]);
			vertexData[7] = z * ((wt[1] * w0) + (wt[4] * h0) + wt[7]);
		}

		//TODO: override all sprite methods about transforms

		calculateTrimmedVertices() {
			const wid = (this.transform as any)._worldID;
			const tuid = (this._texture as any)._updateID;
			if (!this.vertexTrimmedData) {
				this.vertexTrimmedData = new Float32Array(8);
			}
			else if (this._transformTrimmedID === wid && this._textureTrimmedID === tuid) {
				return;
			}

			this._transformTrimmedID = wid;
			this._textureTrimmedID = tuid;

			// lets do some special trim code!
			const texture = this._texture;
			const vertexData = this.vertexTrimmedData;
			const orig = texture.orig;
			const anchor = this._anchor;

			// lets calculate the new untrimmed bounds..
			const wt = this.proj.world.mat3;

			const w1 = -anchor._x * orig.width;
			const w0 = w1 + orig.width;

			const h1 = -anchor._y * orig.height;
			const h0 = h1 + orig.height;

			let z = 1.0 / (wt[2] * w1 + wt[5] * h1 + wt[8]);
			vertexData[0] = z * ((wt[0] * w1) + (wt[3] * h1) + wt[6]);
			vertexData[1] = z * ((wt[1] * w1) + (wt[4] * h1) + wt[7]);

			z = 1.0 / (wt[2] * w0 + wt[5] * h1 + wt[8]);
			vertexData[2] = z * ((wt[0] * w0) + (wt[3] * h1) + wt[6]);
			vertexData[3] = z * ((wt[1] * w0) + (wt[4] * h1) + wt[7]);

			z = 1.0 / (wt[2] * w0 + wt[5] * h0 + wt[8]);
			vertexData[4] = z * ((wt[0] * w0) + (wt[3] * h0) + wt[6]);
			vertexData[5] = z * ((wt[1] * w0) + (wt[4] * h0) + wt[7]);

			z = 1.0 / (wt[2] * w1 + wt[5] * h0 + wt[8]);
			vertexData[6] = z * ((wt[0] * w0) + (wt[3] * h0) + wt[6]);
			vertexData[7] = z * ((wt[1] * w0) + (wt[4] * h0) + wt[7]);
		}
	}
}
