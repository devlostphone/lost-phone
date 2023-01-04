/* By musk License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

	Draws 40 layers of antialiased circle patterns. 
	Use mouse to set alpha, size, distribution. 
	Test it with different images, videos, webcams.

	Inspired by the processing example

*/
---
name: Pointillize Filter
type: fragment
author: https://www.shadertoy.com/view/ls23DG
uniform.alpha: { "type": "1f", "value": 1.0 }
uniform.origin: { "type": "1f", "value": 2.0 }
uniform.iChannel0: { "type": "sampler2D", "value": null, "textureData": { "repeat": true } }
uniform.iChannel1: { "type": "sampler2D", "value": null, "textureData": { "repeat": false } }
---

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D iChannel0;
uniform sampler2D iChannel1;
uniform float alpha;
uniform float origin;
varying vec2 fragCoord;

//2D texture based 3 component 1D, 2D, 3D noise
vec3 iChannelResolution = vec3(1242, 2209, 64.0);
vec3 noise(float p){return texture2D(iChannel0,vec2(p/iChannelResolution.x,.0)).xyz;}
vec3 noise(vec2 p){return texture2D(iChannel0,p/iChannelResolution.xy).xyz;}
vec3 noise(vec3 p){float m = mod(p.z,1.0);float s = p.z-m; float sprev = s-1.0;if (mod(s,2.0)==1.0) { s--; sprev++; m = 1.0-m; };return mix(texture2D(iChannel0,p.xy/iChannelResolution.xy+noise(sprev).yz).xyz,texture2D(iChannel0,p.xy/iChannelResolution.xy+noise(s).yz).xyz,m);}

void main(void)
{
	vec2 uv = fragCoord.xy / resolution.xy;
	
	vec3 color = vec3(1.0);
	
	float var_size = 0.2;
	float var_alpha = .4;
	float var_distr = 1.0;
		
	for (float q=.0; q<1.0; q+=.01)
	{
		float i = q;
		vec2 size = vec2(1.00-pow(i,var_distr)*.97) * var_size;
		size.x *= resolution.y/resolution.x;
		
		vec2 m = mod(uv+noise(q).yz*24.0,size);
		vec2 s = uv-m;
		
		vec2 offs = (.2+.6*noise(s*1466.1550+vec2(time*2.5)).xy);
		vec2 p = m/size - offs;
		vec3 sample_color = texture2D(iChannel1,s + .25*size).xyz;
		
		float alpha = 1.0-(length(p)-.2)*resolution.y*length(size)*.5;
		alpha = min(var_alpha,max(.0,alpha));
		color = mix(color,sample_color,alpha);
	}

	gl_FragColor = vec4(color,1.0);
}

---
name: starfield
type: fragment
author: by bhpcv252 https://www.shadertoy.com/view/fsSfD3
uniform.size: { "type": "1f", "value": 16.0 }
---

precision mediump float;
uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

float speed = 0.3;

float n11(float p) {
	return fract(sin(p*154.101)*313.019);
}

float n21(vec2 p) {
	return sin(dot(p, vec2(7., 157.)));
}

float star(vec3 p) {
	float z = 1.;
	vec2 gv = fract(p.xy*z) - 0.5;
	vec2 id = floor(p.xy*z);
	gv.x += sin(n21(id)*354.23) * 0.3;
	gv.y += sin(n11(n21(id))*914.19) * 0.3;
	float r = n11(n21(id));
	return 0.1*n11(r)*abs(sin(p.z+r*133.12))*0.4/length(gv)*0.1;
}

float stars(in vec3 p) {
	float z = 1., m = 0.;
	for(int i=1; i<=6;i++){
		vec3 t = vec3(0., 0., p.z + time * speed);
		z *= 2.;
		m += star(vec3(p.xy*z, 1.)+t);
	}
	return m;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / min(resolution.x, resolution.y);
    float m = stars(vec3(uv, time * speed));
	fragColor = vec4(m, m, m, 1.);

}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Cloudy Sky with Stars
type: fragment
author: by bhpcv252 https://www.shadertoy.com/view/fsSfD3
uniform.size: { "type": "1f", "value": 16.0 }
---
#define NS 100.
#define CI 0.3

precision mediump float;
uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

float N21(vec2 p) {
    return fract(sin(p.x*100.+p.y*7446.)*8345.);
}

float SS(vec2 uv) {
    vec2 lv = fract(uv);
    lv = lv*lv*(3.-2.*lv);
    vec2 id = floor(uv);
    
    float bl = N21(id);
    float br = N21(id+vec2(1., 0.));
    float b = mix(bl, br, lv.x);

    float tl = N21(id+vec2(0., 1.));
    float tr = N21(id+vec2(1., 1.));
    float t = mix(tl, tr, lv.x);

    return mix(b, t, lv.y);
}

float L(vec2 uv, vec2 ofs, float b, float l) {
    return smoothstep(0., 1000., b*max(0.1, l)/pow(max(0.0000000000001, length(uv-ofs)), 1./max(0.1, l)));
}

float rand(vec2 co, float s){
    float PHI = 1.61803398874989484820459;
    return fract(tan(distance(co*PHI, co)*s)*co.x);
}

vec2 H12(float s) {
    float x = rand(vec2(243.234,63.834), s)-.5;
    float y = rand(vec2(53.1434,13.1234), s)-.5;
    return vec2(x, y);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord/resolution.xy;

    uv -= .5;
    uv.x *= resolution.x/resolution.y;
   
    vec4 col = vec4(.0);
    
    vec4 b = vec4(0.01176470588, 0.05098039215, 0.14117647058, 1.);
    vec4 p = vec4(0.13333333333, 0.07843137254, 0.13725490196, 1.);
    vec4 lb = vec4(0.10196078431, 0.21568627451, 0.33333333333, 1.);
    
    vec4 blb = mix(b, lb, -uv.x*.2-(uv.y*.5));
    
    col += mix(blb, p, uv.x-(uv.y*1.5));
    
    for(float i=0.; i < NS; i++) {
    
        vec2 ofs = H12(i+1.);
        ofs *= vec2(1.8, 1.1);
        float r = (mod(i, 20.) == 0.)? 0.5+abs(sin(i/50.)): 0.25;
        col += vec4(L(uv, ofs, r+(sin(fract(time)*.5*i)+1.)*0.02, 1.));
    }
    
    uv.x += time*.03;
    
    float c = 0.;
    
    for(float i = 1.; i < 8.; i+=1.) {
        c += SS(uv*pow(2.,i))*pow(0.5, i);
    }
    
    col = col + c * CI;

    fragColor = col;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

// ----------------------------------------------------------------------------------------
//	"Beau ké?" by Antoine Clappier - Jan 2022
//
//	Licensed under:
//  A Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
//	http://creativecommons.org/licenses/by-nc-sa/4.0/
// ----------------------------------------------------------------------------------------
//
//   A quick Shadertoy done while cooking for new year’s eve!
//
//   (Inspired by a wallpaper seen on Samsung's store)

---
name: Beau ké?
type: fragment
author: by Antoine Clappier - Jan 2022
uniform.size: { "type": "1f", "value": 16.0 }
---

precision mediump float;
uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;

const float Count = 50.0;
const float R0 = 0.04666663;
const float R1 = 0.18769214;
const float B0 = 0.0;
const float B1 = 0.216524;
const float Bf = 0.095584;
const float Blur = 23.282028;
const float Alpha = 0.464387;
const float ColInter = 0.0;
const vec3 Color0 = vec3(0.0, 0.635327, 0.728205);
const vec3 Color1 = vec3(0.0, 0.273722, 0.785185);

#define SinN(x) (0.5 + 0.5*sin(x))

// Dave Hoskins hash functions
// https://www.shadertoy.com/view/4djSRW
vec3 hash31(float p)
{
   vec3 p3 = fract(vec3(p) * vec3(.1031, .1030, .0973));
   p3 += dot(p3, p3.yzx+19.19);
   return fract((p3.xxy+p3.yzz)*p3.zyx);
}

vec2 hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yzx+19.19);
    return 2.0*fract((p3.xx+p3.yz)*p3.zy)-1.0;
}

// Inigo Quilez - Gradient Noise 2D
// https://www.shadertoy.com/view/XdXGW8
float Noise( in vec2 p )
{
    vec2 i = floor( p ), f = fract( p );
	vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( dot( hash22( i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( hash22( i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( hash22( i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( hash22( i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

// Inigo Quilez - SDF
// https://iquilezles.org/articles/distfunctions2d
float sdHexagon( in vec2 p, in float r )
{
    const vec3 k = vec3(-0.866025404,0.5,0.577350269);
    p  = abs(p.yx);
    p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
    p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
    return length(p)*sign(p.y);
}


void Draw(in vec2 p, in vec2 t, in float r, in float b, in float k, inout vec3 col)
{
	float sd = sdHexagon(p-t, max(0.0, r-b));
	float s  = smoothstep(b, 0.0, sd);
	float bs = smoothstep(0.01, 0.0, b);
    float sh = 0.0, ns = 0.0;
    if(bs > 0.01)
    {
	    sh = smoothstep(0.005, 0.0, abs(sd));
	    ns = Noise(bs*140.0*(p+0.8*t));
    }

	vec3 c = mix(Color0, Color1, k);
	col += Alpha*s*c*(1.0+bs*(0.2*sh+0.1*ns));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    float dp = 1.0/resolution.y;
    vec2  p  = dp*fragCoord;
	float rt = dp*resolution.x;
    float t  = 0.075*time;

    // Render:
    vec3 col = vec3(0);
    for(float k=0.0; k<Count; k++)
    {
        // Randomize position, radius, color and bluriness:
    	vec3 r0 = hash31(k+45.0), r1 = hash31(k+111.0), r2 = hash31(k+343.0);
    	float x, y, radius, blur;
    	x = rt*r0.x+0.7*(0.05+0.2*r1.y)*sin((1.+3.*r1.x)*t+107.*k)*SinN(1.3*t+47.*k);
    	y = (1.-(0.1+0.9*r0.y))*r0.z + (0.1+0.9*r0.y)*SinN(t+127.*k);
    	radius = mix(R0, R1, r1.z);
    	blur = mix(B0, B1, r2.x);
    	blur = max(0.0, blur + Bf*sin((0.5 + 1.5*r2.y)*t+53.0*k)*SinN(0.5*t+223.*k));
    	Draw(p, vec2(x,y), radius, dp + blur, r1.z, col);
    }

    // Tone mapping and vignette:
    col = pow(1.2*col, vec3(4.0));
	col = pow(col / (1.0 + col), vec3(0.25));
	col *= smoothstep(1.1, 0.6, length(p-0.5*vec2(rt,1.0)));

    fragColor = vec4(col, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Bokeh Paralax
type: fragment
author: Krzysztof Narkowicz @knarkowicz
uniform.size: { "type": "1f", "value": 16.0 }
---

precision mediump float;
uniform float time;
uniform vec2 resolution;
varying vec2 fragCoord;
const float MATH_PI	= float( 3.14159265359 );

void Rotate( inout vec2 p, float a ) 
{
	p = cos( a ) * p + sin( a ) * vec2( p.y, -p.x );
}

float Circle( vec2 p, float r )
{
    return ( length( p / r ) - 1.0 ) * r;
}

float Rand( vec2 c )
{
	return fract( sin( dot( c.xy, vec2( 12.9898, 78.233 ) ) ) * 43758.5453 );
}

float saturate( float x )
{
	return clamp( x, 0.0, 1.0 );
}

void BokehLayer( inout vec3 color, vec2 p, vec3 c )   
{
    float wrap = 450.0;    
    if ( mod( floor( p.y / wrap + 0.5 ), 2.0 ) == 0.0 )
    {
        p.x += wrap * 0.5;
    }    
    
    vec2 p2 = mod( p + 0.5 * wrap, wrap ) - 0.5 * wrap;
    vec2 cell = floor( p / wrap + 0.5 );
    float cellR = Rand( cell );
        
    c *= fract( cellR * 3.33 + 3.33 );    
    float radius = mix( 30.0, 70.0, fract( cellR * 7.77 + 7.77 ) );
    p2.x *= mix( 0.9, 1.1, fract( cellR * 11.13 + 11.13 ) );
    p2.y *= mix( 0.9, 1.1, fract( cellR * 17.17 + 17.17 ) );
    
    float sdf = Circle( p2, radius );
    float circle = 1.0 - smoothstep( 0.0, 1.0, sdf * 0.04 );
    float glow	 = exp( -sdf * 0.025 ) * 0.3 * ( 1.0 - circle );
    color += c * ( circle + glow );
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{    
	vec2 uv = fragCoord.xy / resolution.xy;
	vec2 p = ( 2.0 * fragCoord - resolution.xy ) / resolution.x * 1000.0;
    
    // background
	vec3 color = mix( vec3( 0.3, 0.1, 0.3 ), vec3( 0.1, 0.4, 0.5 ), dot( uv, vec2( 0.2, 0.7 ) ) );

    float time = time - 15.0;
    
    Rotate( p, 0.2 + time * 0.03 );
    BokehLayer( color, p + vec2( -50.0 * time +  0.0, 0.0  ), 3.0 * vec3( 0.4, 0.1, 0.2 ) );
	Rotate( p, 0.3 - time * 0.05 );
    BokehLayer( color, p + vec2( -70.0 * time + 33.0, -33.0 ), 3.5 * vec3( 0.6, 0.4, 0.2 ) );
	Rotate( p, 0.5 + time * 0.07 );
    BokehLayer( color, p + vec2( -60.0 * time + 55.0, 55.0 ), 3.0 * vec3( 0.4, 0.3, 0.2 ) );
    Rotate( p, 0.9 - time * 0.03 );
    BokehLayer( color, p + vec2( -25.0 * time + 77.0, 77.0 ), 3.0 * vec3( 0.4, 0.2, 0.1 ) );    
    Rotate( p, 0.0 + time * 0.05 );
    BokehLayer( color, p + vec2( -15.0 * time + 99.0, 99.0 ), 3.0 * vec3( 0.2, 0.0, 0.4 ) );     

	fragColor = vec4( color, 1.0 );
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Stripes
type: fragment
author: Richard Davey
uniform.size: { "type": "1f", "value": 16.0 }
---

precision mediump float;

uniform float size;
uniform vec2 resolution;

varying vec2 fragCoord;

void main(void)
{
    vec3 black = vec3(0.0, 0.0, 0.0);
    vec3 white = vec3(1.0, 1.0, 1.0);
    bool color = (mod((fragCoord.y / resolution.y) * size, 1.0) > 0.5);

    if (!color)
    {
        gl_FragColor = vec4(white, 1.0);
    }
}

---
name: HSL
type: fragment
author: Per Bloksgaard
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;


// Created by Per Bloksgaard/2014

#define PI 3.14159265358979

// Convert HSL colorspace to RGB. http://en.wikipedia.org/wiki/HSL_and_HSV
vec3 HSLtoRGB(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
    return c.z+c.y*(rgb-0.5)*(1.-abs(2.*c.z-1.));
}

vec3 HSL2RGB_CubicSmooth(in vec3 c)
{
    vec3 rgb = clamp(abs(mod(c.x+vec3(0.,4.,2.),6.)-3.)-1.,0.,1.);
    rgb = rgb*rgb*(3.0-2.0*rgb); // iq's cubic smoothing.
    return c.z+ c.y*(rgb-0.5)*(1.-abs(2.*c.z-1.));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (-1.+2.*fragCoord.xy/resolution.xy)*vec2(resolution.x/resolution.y,1.);
    float fAngle = time*0.4;
    float h = atan(uv.x,uv.y) - fAngle;
    float x = length(uv);
    float a = -(0.6+0.2*sin(time*3.1+sin((time*0.8+h*2.0)*3.0))*sin(time+h));
    float b = -(0.8+0.3*sin(time*1.7+sin((time+h*4.0))));
    float c = 1.25+sin((time+sin((time+h)*3.0))*1.3)*0.15;
    float l = a*x*x + b*x + c;
    //vec3 hsl_standard = HSLtoRGB(vec3(h*3./PI,1.,l));
    vec3 hsl_cubic = HSL2RGB_CubicSmooth(vec3(h*3.0/PI,1.,l));
    //  dot product = distance from black (set as the alpha)
    // fragColor = vec4(hsl_cubic, dot(black, hsl_cubic));
    fragColor = vec4(hsl_cubic, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);

    // vec4 black = vec4(0.0, 0.0, 0.0, 1.0);

    if (gl_FragColor.x == 0.0 && gl_FragColor.y == 0.0 && gl_FragColor.z == 0.0)
    {
        gl_FragColor.a = 0.0;
    }

    // gl_FragColor.a = dot(black, gl_FragColor);
}

---
name: Marble
type: fragment
author: klk (https://www.shadertoy.com/view/XsVSzW)
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = (fragCoord.xy / resolution.xx-0.5)*8.0;
    vec2 uv0=uv;
    float i0=1.0;
    float i1=1.0;
    float i2=1.0;
    float i4=0.0;
    for(int s=0;s<7;s++)
    {
        vec2 r;
        r=vec2(cos(uv.y*i0-i4+time/i1),sin(uv.x*i0-i4+time/i1))/i2;
        r+=vec2(-r.y,r.x)*0.3;
        uv.xy+=r;

        i0*=1.93;
        i1*=1.15;
        i2*=1.7;
        i4+=0.05+0.1*time*i1;
    }
    float r=sin(uv.x-time)*0.5+0.5;
    float b=sin(uv.y+time)*0.5+0.5;
    float g=sin((uv.x+uv.y+sin(time*0.5))*0.5)*0.5+0.5;
    fragColor = vec4(r,g,b,1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Flower Plasma
type: fragment
author: epsilum (https://www.shadertoy.com/view/Xdf3zH)
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

float addFlower(float x, float y, float ax, float ay, float fx, float fy)
{
    float xx=(x+sin(time*fx)*ax)*8.0;
    float yy=(y+cos(time*fy)*ay)*8.0;
    float angle = atan(yy,xx);
    float zz = 1.5*(cos(18.0*angle)*0.5+0.5) / (0.7 * 3.141592) + 1.2*(sin(15.0*angle)*0.5+0.5)/ (0.7 * 3.141592);

    return zz;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 xy=(fragCoord.xy/resolution.x)*2.0-vec2(1.0,resolution.y/resolution.x);

    float x=xy.x;
    float y=xy.y;

    float p1 = addFlower(x, y, 0.8, 0.9, 0.95, 0.85);
    float p2 = addFlower(x, y, 0.7, 0.9, 0.42, 0.71);
    float p3 = addFlower(x, y, 0.5, 1.0, 0.23, 0.97);
    float p4 = addFlower(x, y, 0.8, 0.5, 0.81, 1.91);

    float p=clamp((p1+p2+p3+p4)*0.25, 0.0, 1.0);

    vec4 col;
    if (p < 0.5)
        col=vec4(mix(0.0,1.0,p*2.0), mix(0.0,0.63,p*2.0), 0.0, 1.0);
    else if (p >= 0.5 && p <= 0.75)
        col=vec4(mix(1.0, 1.0-0.32, (p-0.5)*4.0), mix(0.63, 0.0, (p-0.5)*4.0), mix(0.0,0.24,(p-0.5)*4.0), 1.0);
    else
        col=vec4(mix(0.68, 0.0, (p-0.75)*4.0), 0.0, mix(0.24, 0.0, (p-0.75)*4.0), 1.0);

    fragColor = col;
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}

---
name: Plasma
type: fragment
author: triggerHLM (https://www.shadertoy.com/view/MdXGDH)
---

precision mediump float;

uniform float time;
uniform vec2 resolution;

varying vec2 fragCoord;

const float PI = 3.14159265;

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {

    float time = time * 0.2;

    float color1, color2, color;

    color1 = (sin(dot(fragCoord.xy,vec2(sin(time*3.0),cos(time*3.0)))*0.02+time*3.0)+1.0)/2.0;

    vec2 center = vec2(640.0/2.0, 360.0/2.0) + vec2(640.0/2.0*sin(-time*3.0),360.0/2.0*cos(-time*3.0));

    color2 = (cos(length(fragCoord.xy - center)*0.03)+1.0)/2.0;

    color = (color1+ color2)/2.0;

    float red   = (cos(PI*color/0.5+time*3.0)+1.0)/2.0;
    float green = (sin(PI*color/0.5+time*3.0)+1.0)/2.0;
    float blue  = (sin(+time*3.0)+1.0)/2.0;

    fragColor = vec4(red, green, blue, 1.0);
}

void main(void)
{
    mainImage(gl_FragColor, fragCoord.xy);
    gl_FragColor.a = 1.0;
}
