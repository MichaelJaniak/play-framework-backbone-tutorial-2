package actions;

import play.mvc.Action;
import play.mvc.Http.Context;
import play.mvc.Http.Response;
import play.mvc.Result;

public class CORSAction extends Action.Simple{
	public final String crossOriginUrl= "http://127.0.0.1:8020";

	@Override
	public Result call(Context ctx) throws Throwable {
//		https://developer.mozilla.org/en-US/docs/HTTP/Access_control_CORS?redirectlocale=en-US&redirectslug=HTTP_access_control
		ctx.response().setHeader("Access-Control-Allow-Origin", crossOriginUrl);
		ctx.response().setHeader("Access-Control-Allow-Methods", "OPTIONS, POST, GET, PUT, DELETE");		
		ctx.response().setHeader("Access-Control-Allow-Headers", "Content-Type");		
		ctx.response().setHeader("Content-Type", "application/json");		
		return delegate.call(ctx);
	}

}