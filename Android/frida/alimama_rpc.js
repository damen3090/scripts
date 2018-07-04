//getMtopRequest: MtopRequest [ apiName=mtop.alimama.moon.provider.shareinfo.get, version=1.0, data={"url":"https:\/\/uland.taobao.com\/coupon\/edetail?e=fZQR5p5z8PoGQASttHIRqVCc5tpy2QNFb9gcZeG4nv2JBiHzvBsckTN7UcWoDz6mCksCmRgjp8eBmB5HaMYmzF0NT9weRFwjDfqEFBOhTcyPNEqnS4RSdPhbmf0A7FZQL%2B%2FLt%2FVTh3I%3D&app_pvid=0bab48e015099571002023484ec8e2&ptl=app_pvid%3A0bab48e015099571002023484ec8e2%3Btpp_pvid%3A655593ce-d0c5-4159-887f-087893721bc5&mt&spm=a21wq.9116673.10030.0","spm":"a21wq.9116673.10030.0"}, needEcode=false, needSession=true]
var result = null

rpc.exports = {
	build: function(apiName, data){
		Java.perform(function () {
			try{
				MtopRequest = Java.use('mtopsdk.mtop.domain.MtopRequest')
				mtopreqest = MtopRequest.$new();
				//mtopreqest.setApiName("mtop.alimama.moon.provider.shareinfo.get")
				mtopreqest.setApiName(apiName)
				mtopreqest.setVersion("1.0")
				//mtopreqest.setData('{"url":"https:\/\/uland.taobao.com\/coupon\/edetail?e=fZQR5p5z8PoGQASttHIRqVCc5tpy2QNFb9gcZeG4nv2JBiHzvBsckTN7UcWoDz6mCksCmRgjp8eBmB5HaMYmzF0NT9weRFwjDfqEFBOhTcyPNEqnS4RSdPhbmf0A7FZQL%2B%2FLt%2FVTh3I%3D&app_pvid=0bab48e015099571002023484ec8e2&ptl=app_pvid%3A0bab48e015099571002023484ec8e2%3Btpp_pvid%3A655593ce-d0c5-4159-887f-087893721bc5&mt&spm=a21wq.9116673.10030.0","spm":"a21wq.9116673.10030.0"}')
				mtopreqest.setData(data)
				mtopreqest.setNeedEcode(false)
				mtopreqest.setNeedSession(true)

				MtopProxy = Java.use('mtopsdk.mtop.MtopProxy')
				mtopproxy = MtopProxy.$new(mtopreqest);

				ProtocolParamBuilderImpl = Java.use('mtopsdk.mtop.protocol.builder.ProtocolParamBuilderImpl')
				protocolparambuilderimpl = ProtocolParamBuilderImpl.$new();
				result = protocolparambuilderimpl.buildParams(mtopproxy).toString()
				console.log(result)
			}catch(e){
				console.log(e)
			}
		});
		return result
	}
}